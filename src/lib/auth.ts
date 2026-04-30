// Frontend auth API service — all requests go through Vite proxy to /auth/*

export interface AuthUser {
    id: number;
    email: string;
    name: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    user: AuthUser;
}

const API_BASE = '/auth';

async function handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response (${res.status}). Make sure the backend server is running.`);
    }

    let data;
    try {
        data = await res.json();
    } catch (e) {
        throw new Error('Failed to parse server response. The backend might have crashed.');
    }

    if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);
    return data as T;
}

/** Register with email + password */
export async function registerUser(email: string, password: string, name?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
    });
    return handleResponse<AuthResponse>(res);
}

/** Login with email + password */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
}

/** Logout */
export async function logoutUser(): Promise<void> {
    await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
    });
}

/** Get current session user */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const res = await fetch(`${API_BASE}/me`, {
            credentials: 'include',
        });
        if (res.status === 401) return null;
        const data = await res.json();
        return data.user ?? null;
    } catch {
        return null;
    }
}

/** Redirect to Google OAuth */
export function loginWithGoogle(): void {
    window.location.href = '/auth/google';
}
