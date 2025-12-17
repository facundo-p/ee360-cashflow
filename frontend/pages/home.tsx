// Botonera principal funcional (mock): muestra tipos, resalta último, navega a formulario.
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Botonera from '../components/Botonera';
import { listTipos } from '../lib/api-mock/tipos';

export default function HomePage() {
  const router = useRouter();
  const [tipos, setTipos] = useState<any[]>([]);

  useEffect(() => {
    listTipos().then(setTipos);
  }, []);

  const handleSelect = (tipoId: string) => {
    router.push(`/movimiento-nuevo?tipo=${tipoId}`);
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Seleccionar Movimiento</h1>
      </div>
      <Botonera tipos={tipos} onSelect={handleSelect} />
      <button
        type="button"
        onClick={() => router.push('/movimientos')}
        className="w-full rounded-lg bg-secondary text-gray-900 py-3 font-semibold border border-border hover:opacity-90 transition"
      >
        Ver movimientos
      </button>
    </main>
  );
}


