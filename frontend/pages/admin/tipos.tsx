// Gestión de tipos de movimiento (admin). Mock: lista y permite toggles ficticios.
import React, { useEffect, useState } from 'react';
import { listTipos } from '../../lib/api-mock/tipos';

export default function AdminTiposPage() {
  const [tipos, setTipos] = useState<any[]>([]);
  useEffect(() => {
    listTipos().then(setTipos);
  }, []);

  const toggleActivo = (id: string) => {
    setTipos((prev) => prev.map((t) => (t.id === id ? { ...t, activo: !t.activo } : t)));
  };

  return (
    <main className="page">
      <h1>Tipos de movimiento (mock admin)</h1>
      <div style={{ display: 'grid', gap: 8 }}>
        {tipos.map((t) => (
          <div
            key={t.id}
            style={{ padding: 12, border: '1px solid #ddd', borderRadius: 10, display: 'grid', gap: 4 }}
          >
            <strong>{t.nombre}</strong>
            <span>Sentido: {t.sentido}</span>
            <span>Monto sugerido: {t.monto_sugerido ?? '—'}</span>
            <span>Medio sugerido: {t.medio_pago_id ?? '—'}</span>
            <span>Plan: {t.es_plan ? 'Sí' : 'No'}</span>
            <button onClick={() => toggleActivo(t.id)}>{t.activo ? 'Desactivar (mock)' : 'Activar (mock)'}</button>
          </div>
        ))}
      </div>
    </main>
  );
}


