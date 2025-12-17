// Login mock funcional: permite elegir email seed y entrar al flujo mock.
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionMock } from '../hooks/useSessionMock';
import { usuariosSeed } from '../__mocks__/usuarios';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSessionMock();
  const [email, setEmail] = useState(usuariosSeed[0]?.email ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = await login(email);
    if (!u) {
      setError('Usuario no encontrado en mock.');
      return;
    }
    setError(null);
    router.push('/home');
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Login (mock)</h1>
        <p className="text-sm text-gray-600">Usa los usuarios seed para entrar al flujo UI.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-soft rounded-xl p-4 border border-border">
        <label className="block space-y-2 text-sm font-medium text-gray-800">
          Email
          <select
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {usuariosSeed.map((u) => (
              <option key={u.id} value={u.email}>
                {u.nombre} ({u.rol}) — {u.email}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary text-white py-3 font-semibold hover:opacity-90 transition"
        >
          Ingresar
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}


