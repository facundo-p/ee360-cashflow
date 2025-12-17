// Gestión de usuarios (admin). Mock lista usuarios seed.
import React, { useEffect, useState } from 'react';
import { listUsuarios } from '../../lib/api-mock/usuarios';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  useEffect(() => {
    listUsuarios().then(setUsuarios);
  }, []);

  return (
    <main className="page">
      <h1>Usuarios (mock admin)</h1>
      <div style={{ display: 'grid', gap: 8 }}>
        {usuarios.map((u) => (
          <div key={u.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 10 }}>
            <strong>{u.nombre}</strong> — {u.email} — rol: {u.rol}
            <div>Estado: {u.estado ?? 'activo'}</div>
          </div>
        ))}
      </div>
    </main>
  );
}


