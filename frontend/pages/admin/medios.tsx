// Gestión de medios de pago (admin). Mock: lista y toggles.
import React, { useEffect, useState } from 'react';
import { listMedios } from '../../lib/api-mock/medios';

export default function AdminMediosPage() {
  const [medios, setMedios] = useState<any[]>([]);
  useEffect(() => {
    listMedios().then(setMedios);
  }, []);

  const toggle = (id: string) => {
    setMedios((prev) => prev.map((m) => (m.id === id ? { ...m, activo: !m.activo } : m)));
  };

  return (
    <main className="page">
      <h1>Medios de pago (mock admin)</h1>
      <div style={{ display: 'grid', gap: 8 }}>
        {medios.map((m) => (
          <div key={m.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 10 }}>
            <strong>{m.nombre}</strong> · Orden {m.orden}
            <div>
              <button onClick={() => toggle(m.id)}>{m.activo ? 'Desactivar (mock)' : 'Activar (mock)'}</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


