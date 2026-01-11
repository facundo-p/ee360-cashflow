// Edición de movimiento: con layout responsivo.
import React from 'react';
import { useRouter } from 'next/router';
import FormMovimiento from '../../components/FormMovimiento';
import { AppLayout } from '../../components/layouts';

export default function EditarMovimientoPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  
  return (
    <AppLayout mobileContainerClass="form-container">
      {id ? <FormMovimiento mode="edit" movimientoId={id} /> : <p className="form-tipo-label">Cargando...</p>}
    </AppLayout>
  );
}
