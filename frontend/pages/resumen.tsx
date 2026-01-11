// Resumen del día: estadísticas con layout responsivo.
import React from 'react';
import DailySummary from '../components/DailySummary';
import { AppLayout } from '../components/layouts';
import { useIsDesktop } from '../hooks/useMediaQuery';

function ResumenContent() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="desktop-content">
        <header className="desktop-content-header">
          <h1 className="desktop-content-title">Resumen del Día</h1>
        </header>
        <div className="desktop-content-main">
          <DailySummary />
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="resumen-header">
        <h1 className="title-primary">Resumen del Día</h1>
      </header>
      <main className="resumen-main">
        <DailySummary />
      </main>
    </>
  );
}

export default function ResumenPage() {
  return (
    <AppLayout mobileContainerClass="resumen-container">
      <ResumenContent />
    </AppLayout>
  );
}
