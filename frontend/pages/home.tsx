// Home: página principal con layout responsivo
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Botonera from '../components/Botonera';
import Dashboard from '../components/Dashboard';
import { AppLayout } from '../components/layouts';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { listTipos } from '../lib/api-mock/tipos';

function MobileHomeContent() {
  const router = useRouter();
  const [tipos, setTipos] = useState<any[]>([]);

  useEffect(() => {
    listTipos().then(setTipos);
  }, []);

  const handleSelect = (tipoId: string) => {
    router.push(`/movimiento-nuevo?tipo=${tipoId}`);
  };

  return (
    <>
      <header className="page-header">
        <h1 className="title-primary">Cashflow EE360</h1>
        <h2 className="title-secondary">Tipo de movimiento</h2>
      </header>

      <div className="page-divider" />

      <main className="page-main">
        <Botonera tipos={tipos} onSelect={handleSelect} />
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
