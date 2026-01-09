// Resumen del día: estadísticas de ingresos, egresos y movimientos por tipo.
import React, { useEffect, useMemo, useState } from 'react';
import { listMovimientos } from '../lib/api-mock/movimientos';
import { listTipos } from '../lib/api-mock/tipos';
import BottomNav from '../components/BottomNav';

export default function ResumenPage() {
  const [movs, setMovs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    listMovimientos().then(setMovs);
    listTipos().then(setTipos);
  }, []);

  // Filtrar movimientos del día
  const movsHoy = useMemo(() => {
    return movs.filter((m) => m.fecha === hoy);
  }, [movs, hoy]);

  // Calcular totales
  const totales = useMemo(() => {
    const ingresos = movsHoy
      .filter((m) => m.sentido === 'ingreso')
      .reduce((sum, m) => sum + (m.monto ?? 0), 0);
    const egresos = movsHoy
      .filter((m) => m.sentido === 'egreso')
      .reduce((sum, m) => sum + (m.monto ?? 0), 0);
    return {
      ingresos,
      egresos,
      balance: ingresos - egresos,
      cantidadTotal: movsHoy.length,
    };
  }, [movsHoy]);

  // Contar movimientos por tipo
  const movsPorTipo = useMemo(() => {
    const counts: Record<string, number> = {};
    movsHoy.forEach((m) => {
      counts[m.tipo_movimiento_id] = (counts[m.tipo_movimiento_id] || 0) + 1;
    });
    return tipos
      .map((t) => ({
        id: t.id,
        nombre: t.nombre,
        sentido: t.sentido,
        cantidad: counts[t.id] || 0,
      }))
      .filter((t) => t.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [movsHoy, tipos]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="resumen-container">
      <header className="resumen-header">
        <h1 className="title-primary">Resumen del Día</h1>
      </header>

      <main className="resumen-main">
        <p className="resumen-date">{formatDate(hoy)}</p>

        {/* Cards de totales */}
        <div className="resumen-cards">
          <div className="resumen-card resumen-card-ingreso">
            <p className="resumen-card-label">Ingresos</p>
            <p className="resumen-card-value">${totales.ingresos.toLocaleString()}</p>
          </div>
          <div className="resumen-card resumen-card-egreso">
            <p className="resumen-card-label">Egresos</p>
            <p className="resumen-card-value">${totales.egresos.toLocaleString()}</p>
          </div>
          <div className="resumen-card resumen-card-balance">
            <p className="resumen-card-label">Balance</p>
            <p className="resumen-card-value">
              {totales.balance >= 0 ? '+' : ''}${totales.balance.toLocaleString()}
            </p>
          </div>
          <div className="resumen-card resumen-card-count">
            <p className="resumen-card-label">Movimientos</p>
            <p className="resumen-card-value">{totales.cantidadTotal}</p>
          </div>
        </div>

        {/* Desglose por tipo */}
        {movsPorTipo.length > 0 && (
          <>
            <h2 className="resumen-section-title">Movimientos por tipo</h2>
            <div className="resumen-tipo-list">
              {movsPorTipo.map((t) => (
                <div key={t.id} className="resumen-tipo-item">
                  <span className="resumen-tipo-name">{t.nombre}</span>
                  <span className="resumen-tipo-count">{t.cantidad}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {movsHoy.length === 0 && (
          <p className="list-empty">No hay movimientos registrados hoy.</p>
        )}
      </main>

      <div className="page-divider" />
      <BottomNav />
    </div>
  );
}
