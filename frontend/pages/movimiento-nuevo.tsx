// Formulario de movimiento (crear). Sin scroll; foco/teclado según monto sugerido.
import React from 'react';
import FormMovimiento from '../components/FormMovimiento';

export default function MovimientoNuevoPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <FormMovimiento mode="create" />
    </main>
  );
}


