// API calls for Authentication
import api, { setAuthToken, getAuthToken } from './client';

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: Usuario;
};

// Login and store token
export async function login(credentials: LoginInput): Promise<LoginResult> {
  const result = await api.post<LoginResult>('/auth/login', credentials, { skipAuth: true });
  setAuthToken(result.token);
  return result;
}

// Logout and clear token
export function logout(): void {
  setAuthToken(null);
}

// Get current user from stored token
export async function getCurrentUser(): Promise<Usuario | null> {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    return await api.get<Usuario>('/auth/me');
  } catch (e) {
    // If unauthorized, clear token
    if ((e as any).status === 401) {
      setAuthToken(null);
    }
    return null;
  }
}

// Check if user is logged in (has valid token)
export function isLoggedIn(): boolean {
  return !!getAuthToken();
}

// Re-export token functions for use elsewhere
export { setAuthToken, getAuthToken };
