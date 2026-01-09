// Formulario de movimiento (crear). Estilo espartano con BottomNav.
import React from 'react';
import FormMovimiento from '../components/FormMovimiento';
import BottomNav from '../components/BottomNav';

export default function MovimientoNuevoPage() {
  return (
    <div className="form-container">
      <FormMovimiento mode="create" />
      <div className="page-divider" />
      <BottomNav />
    </div>
  );
}


