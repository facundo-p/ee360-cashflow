// Edición de movimiento: estilo espartano con BottomNav.
import React from 'react';
import { useRouter } from 'next/router';
import FormMovimiento from '../../components/FormMovimiento';
import BottomNav from '../../components/BottomNav';

export default function EditarMovimientoPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  return (
    <div className="form-container">
      {id ? <FormMovimiento mode="edit" movimientoId={id} /> : <p className="form-tipo-label">Cargando...</p>}
      <div className="page-divider" />
      <BottomNav />
    </div>
  );
}


