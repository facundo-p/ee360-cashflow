// DailySummary: resumen del día con totales y desglose por tipo
import React, { useEffect, useMemo, useState } from 'react';
import { listMovimientos } from '../lib/api-mock/movimientos';
import { listTipos } from '../lib/api-mock/tipos';

type Props = {
  compact?: boolean;
  refreshKey?: number;
};

export default function DailySummary({ compact = false, refreshKey = 0 }: Props) {
  const [movs, setMovs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    listMovimientos().then(setMovs);
    listTipos().then(setTipos);
  }, [refreshKey]);

  // Filter today's movements
  const movsHoy = useMemo(() => {
    return movs.filter((m) => m.fecha === hoy);
  }, [movs, hoy]);

  // Calculate totals
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

  // Count movements by type
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

  if (compact) {
    return (
      <div className="summary-compact">
        <h2 className="summary-compact-title">Resumen del Día</h2>
        <p className="summary-compact-date">{formatDate(hoy)}</p>
        
        <div className="summary-compact-grid">
          <div className="summary-compact-item summary-compact-ingreso">
            <span className="summary-compact-label">Ingresos</span>
            <span className="summary-compact-value">${totales.ingresos.toLocaleString()}</span>
          </div>
          <div className="summary-compact-item summary-compact-egreso">
            <span className="summary-compact-label">Egresos</span>
            <span className="summary-compact-value">${totales.egresos.toLocaleString()}</span>
          </div>
          <div className="summary-compact-item summary-compact-balance">
            <span className="summary-compact-label">Balance</span>
            <span className="summary-compact-value">
              {totales.balance >= 0 ? '+' : ''}${totales.balance.toLocaleString()}
            </span>
          </div>
          <div className="summary-compact-item summary-compact-count">
            <span className="summary-compact-label">Movimientos</span>
            <span className="summary-compact-value">{totales.cantidadTotal}</span>
          </div>
        </div>

        {movsPorTipo.length > 0 && (
          <div className="summary-compact-breakdown">
            {movsPorTipo.slice(0, 5).map((t) => (
              <div key={t.id} className="summary-compact-tipo">
                <span>{t.nombre}</span>
                <span className="summary-compact-tipo-count">{t.cantidad}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="summary-full">
      <p className="resumen-date">{formatDate(hoy)}</p>

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
    </div>
  );
}
