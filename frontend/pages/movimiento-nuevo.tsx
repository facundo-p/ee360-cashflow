// Formulario de movimiento (crear). Con layout responsivo.
import React from 'react';
import FormMovimiento from '../components/FormMovimiento';
import { AppLayout } from '../components/layouts';

export default function MovimientoNuevoPage() {
  return (
    <AppLayout mobileContainerClass="form-container">
      <FormMovimiento mode="create" />
    </AppLayout>
  );
}
