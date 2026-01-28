// Contexto de autenticación según AUTH_AND_USERS.md
// Maneja: JWT, usuario logueado, login, logout

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// Tipos según AUTH_AND_USERS.md
export type Rol = 'admin' | 'coach';

export type Usuario = {
  id: string;
  nombre: string;
  username: string;
  rol: Rol;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys para localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Rutas públicas (no requieren auth)
const PUBLIC_ROUTES = ['/login', '/'];

type Props = {
  children: React.ReactNode;
  onAuthReset: () => void;
};

export function AuthProvider({ children, onAuthReset }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener token del localStorage
  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  // Guardar token y usuario en localStorage
  const saveSession = useCallback((token: string, userData: Usuario) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Limpiar sesión
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Obtener usuario actual desde el backend
  const fetchCurrentUser = useCallback(async (): Promise<Usuario | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearSession();
        }
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }, [getToken, clearSession]);

  // Login
  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
      throw new Error(error.error || 'Credenciales inválidas');
    }

    const data = await response.json();
    saveSession(data.token, data.user);
    onAuthReset?.(); // Forzar re-render del AuthProvider
    // Redirigir al home
    router.push('/home');
  }, [router, saveSession]);

  // Logout según AUTH_AND_USERS.md: eliminar token del frontend
  const logout = useCallback(() => {
    clearSession();
    onAuthReset(); // Forzar re-render del AuthProvider
    router.push('/login');
  }, [clearSession, router]);

  // Refrescar usuario (útil después de cambios)
  const refreshUser = useCallback(async () => {
    const userData = await fetchCurrentUser();
    if (userData) {
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
  }, [fetchCurrentUser]);

  // Inicialización: cargar sesión existente
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Primero intentar cargar usuario del localStorage (para evitar flash)
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // JSON inválido, limpiar
          clearSession();
        }
      }

      // Validar con el backend
      const token = getToken();
      if (token) {
        const userData = await fetchCurrentUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } else {
          // Token inválido, limpiar
          clearSession();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [getToken, fetchCurrentUser, clearSession]);

  // Protección de rutas: redirigir si no autenticado
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
    
    if (!user && !isPublicRoute) {
      router.push('/login');
    }
    
    // Si está autenticado y está en login, redirigir al home
    if (user && router.pathname === '/login') {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Exportar token para uso en API client
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
