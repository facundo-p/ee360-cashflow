// Edición de movimiento: respeta permisos (mock).
import React from 'react';
import { useRouter } from 'next/router';
import FormMovimiento from '../../components/FormMovimiento';

export default function EditarMovimientoPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {id ? <FormMovimiento mode="edit" movimientoId={id} /> : <p>Cargando...</p>}
    </main>
  );
}


