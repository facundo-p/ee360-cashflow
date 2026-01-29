// Home: página principal con layout responsivo
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Botonera from '../components/Botonera';
import Dashboard from '../components/Dashboard';
import { AppLayout } from '../components/layouts';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { listOpciones } from '../lib/api-unified/tipos';

function MobileHomeContent() {
  const router = useRouter();
  const [opciones, setOpciones] = useState<any[]>([]);

  useEffect(() => {
    listOpciones().then(setOpciones);
  }, []);

  const handleSelect = (opcionId: string) => {
    router.push(`/movimiento-nuevo?opcion=${opcionId}`);
  };

  return (
    <>
      <header className="page-header">
        <h1 className="title-primary">Cashflow EE360</h1>
        <h2 className="title-secondary">Tipo de movimiento</h2>
      </header>

      <div className="page-divider" />

      <main className="page-main">
        <Botonera opciones={opciones} onSelect={handleSelect} />
      </main>
    </>
  );
}

export default function HomePage() {
  const isDesktop = useIsDesktop();

  return (
    <AppLayout>
      {isDesktop ? <Dashboard /> : <MobileHomeContent />}
    </AppLayout>
  );
}
