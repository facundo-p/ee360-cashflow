// Botonera principal funcional (mock): muestra tipos, resalta último, navega a formulario.
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Botonera from '../components/Botonera';
import BottomNav from '../components/BottomNav';
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
    <div className="page-container">
      <header className="page-header">
        <h1 className="title-primary">Cashflow EE360</h1>
        <h2 className="title-secondary">Tipo de movimiento</h2>
      </header>

      <div className="page-divider" />

      <main className="page-main">
        <Botonera tipos={tipos} onSelect={handleSelect} />
      </main>

      <div className="page-divider" />

      <BottomNav />
    </div>
  );
}


