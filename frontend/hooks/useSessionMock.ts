// Mock de sesión: maneja login/logout y rol (admin/usuario) con fallback en localStorage.
import { useEffect, useState } from 'react';
import { loginMock } from '../lib/api-mock/auth';

export type User = { id: string; nombre: string; rol: 'admin' | 'usuario'; email: string } | null;

export function useSessionMock() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('mock_user') : null;
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string) => {
    const u = await loginMock(email);
    if (u && typeof window !== 'undefined') {
      localStorage.setItem('mock_user', JSON.stringify(u));
    }
    setUser(u as User);
    return u;
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('mock_user');
    setUser(null);
  };

  return { user, login, logout };
}


