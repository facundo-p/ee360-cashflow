// Página de Login según AUTH_AND_USERS.md
// Credenciales: username (email) + password

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import { PasswordInput } from '../components/PasswordInput';

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar loading mientras se verifica la sesión inicial
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Iniciar sesión - EE360 Cashflow</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          {/* Logo / Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cashflow</h1>
            <p className="text-sm text-gray-500 mt-1">EE360</p>
          </div>

          {/* Formulario */}
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-5"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Iniciar sesión</h2>
              <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Username (email) */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full px-4 py-3 rounded-xl border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  placeholder-gray-400 text-gray-900
                "
                placeholder="tu@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                required
                minLength={5}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-3 px-4 rounded-xl font-semibold text-white
                bg-primary hover:bg-primary/90
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            v1.0.0
          </p>
        </div>
      </div>
    </>
  );
}
