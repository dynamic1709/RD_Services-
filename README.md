# 🚀 SwiftShip Pro: Modern Courier Aggregator

SwiftShip Pro is a premium, startup-grade courier aggregation platform designed to simplify logistics. It features a high-fidelity mobile-first UI, AI-powered courier recommendations, and a robust authentication system.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Animations**: Framer Motion / Tailwind Animate

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Authentication**: [Passport.js](https://www.passportjs.org/) (Local + Google OAuth 2.0)
- **Security**: [Bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- **Session**: `express-session` with PostgreSQL store

### Database
- **Engine**: [PostgreSQL](https://www.postgresql.org/)
- **Session Store**: `connect-pg-simple`

---

## 📱 Project Flow

The application follows a structured, multi-step booking process designed for maximum conversion:

```mermaid
graph TD
    A[Splash Screen] -->|Auth Check| B{Is Logged In?}
    B -->|No| C[Login / Google Sign-In]
    B -->|Yes| D[Home: Select Service]
    C --> D
    D --> E[Shipment Details: Addresses]
    E --> F[Weight Selection: AI Estimation]
    F --> G[Searching Partners...]
    G --> H[Recommended Couriers: AI Engine]
    H --> I[Partner Details & Ratings]
    I --> J[Time Slot Selection]
    J --> K[Order Summary & Payment]
    K --> L[Booking Success]
    L --> M[Real-time Order Tracking]
```

### Key Features:
- **AI Recommendation Engine**: Ranks courier partners based on price, speed, and reliability.
- **Smart Weight Estimation**: Hooks for AI image-based package weight calculation.
- **Flexible Payments**: Support for "Pay After Pickup" and "Advance Payment".
- **Dynamic Tracking**: Live status updates for active shipments.

---

## ⚙️ Requirements

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Local or hosted instance
- **Google Cloud Console**: Credentials for Google OAuth (optional for local testing)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd swiftship-pro-main
```

### 2. Install Dependencies
Install packages for both the frontend and the backend:
```bash
# Root (Frontend) dependencies
npm install

# Server dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials:
```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/swiftship

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_id_here
GOOGLE_CLIENT_SECRET=your_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Security
SESSION_SECRET=your_random_secret_here

# Ports
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:8080
```

### 4. Running the Application

**Start the Backend:**
```bash
cd server
npm run dev
```

**Start the Frontend:**
(In a new terminal)
```bash
npm run dev
```

The app will be available at **http://localhost:8080**.

---

## 📁 Directory Structure

- `/src`: Frontend React source code.
  - `/components`: Reusable UI elements and screen views.
  - `/context`: Global state management (`AppContext`).
  - `/lib`: Utility functions and API clients.
- `/server`: Node.js Express backend.
  - `index.js`: Main server logic and API endpoints.
- `/public`: Static assets and icons.

---

## 🛠️ Troubleshooting

- **Database Connection**: Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` is correct.
- **Port Conflict**: If port 8080 or 3001 is in use, you can change them in `vite.config.ts` and `.env`.
- **Google Login**: Ensure you've added `http://localhost:3001/auth/google/callback` to your Authorized Redirect URIs in the Google Cloud Console.

---

*Made with ❤️ for modern logistics.*
