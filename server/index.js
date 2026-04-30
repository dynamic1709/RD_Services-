import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

dotenv.config({ path: '../.env' });

const { Pool } = pg;
const PgSession = connectPgSimple(session);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// PostgreSQL Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize DB tables
async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      name VARCHAR(255),
      google_id VARCHAR(255) UNIQUE,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS session (
      sid VARCHAR PRIMARY KEY NOT NULL COLLATE "default",
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
  `);
    console.log('✅ Database initialized');
}

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
}));

app.use(session({
    store: new PgSession({ pool, tableName: 'session' }),
    secret: process.env.SESSION_SECRET || 'swiftship-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport: Serialize / Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0] || false);
    } catch (err) {
        done(err);
    }
});

// ─── Local Strategy (Email + Password) ────────────────────────────────────────
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return done(null, false, { message: 'No account found with that email.' });
        if (!user.password_hash) return done(null, false, { message: 'Please sign in with Google.' });
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// ─── Google OAuth Strategy ────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName;
            const avatar = profile.photos?.[0]?.value;
            const googleId = profile.id;

            // Check if user exists by google_id
            let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
            if (result.rows.length > 0) return done(null, result.rows[0]);

            // Check by email
            result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                // Link Google account
                const updated = await pool.query(
                    'UPDATE users SET google_id = $1, avatar_url = $2, name = $3 WHERE email = $4 RETURNING *',
                    [googleId, avatar, name, email]
                );
                return done(null, updated.rows[0]);
            }

            // Create new user
            const newUser = await pool.query(
                'INSERT INTO users (email, name, google_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
                [email, name, googleId, avatar]
            );
            return done(null, newUser.rows[0]);
        } catch (err) {
            return done(err);
        }
    }));
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// Register
app.post('/auth/register', async (req, res) => {
    console.log('📝 Registration attempt:', req.body.email);
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            console.log('⚠️ Email already exists:', email);
            return res.status(409).json({ error: 'Email already registered.' });
        }

        console.log('🔐 Hashing password...');
        const hash = await bcrypt.hash(password, 12);

        console.log('💾 Inserting user into DB...');
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, avatar_url, created_at',
            [email, hash, name || email.split('@')[0]]
        );
        const user = result.rows[0];

        console.log('👤 User created, logging in...', user.id);
        req.login(user, (err) => {
            if (err) {
                console.error('❌ Login after register failed:', err);
                return res.status(500).json({ error: 'Login after register failed.' });
            }
            console.log('✅ Registration successful:', email);
            res.json({ user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatar_url } });
        });
    } catch (err) {
        console.error('❌ Server error during registration:', err);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login
app.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: 'Authentication error.' });
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ error: 'Session error.' });
            res.json({ user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatar_url } });
        });
    })(req, res, next);
});

// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:8080');
    }
);

app.get('/auth/google/failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}?error=google_auth_failed`);
});

// Current user
app.get('/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        const u = req.user;
        res.json({ user: { id: u.id, email: u.email, name: u.name, avatarUrl: u.avatar_url } });
    } else {
        res.status(401).json({ user: null });
    }
});

// Logout
app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed.' });
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out successfully.' });
        });
    });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 SwiftShip Auth Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to initialize database:', err.message);
    process.exit(1);
});
