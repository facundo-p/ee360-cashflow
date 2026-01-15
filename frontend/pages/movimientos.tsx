// Listado de movimientos con layout responsivo, filtros y exportación CSV.
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listMovimientos } from '../lib/api-unified/movimientos';
import { listTipos } from '../lib/api-unified/tipos';
import { AppLayout } from '../components/layouts';
import { useIsDesktop } from '../hooks/useMediaQuery';

function MovimientosContent() {
  const isDesktop = useIsDesktop();
  const [movs, setMovs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const hoy = new Date().toISOString().slice(0, 10);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  useEffect(() => {
    listMovimientos().then(setMovs);
    listTipos().then(setTipos);
  }, []);

  // Helper to get sentido from enriched or legacy format
  const getSentido = (m: any) => m.categoria_sentido ?? m.sentido ?? 'ingreso';
  const getOpcionId = (m: any) => m.opcion_id ?? m.tipo_movimiento_id;
  const getOpcionNombre = (m: any) => m.opcion_nombre ?? 'Movimiento';
  const getMedioNombre = (m: any) => m.medio_pago_nombre ?? m.medio_pago_id ?? '-';

  const visibles = useMemo(() => {
    return movs
      .filter((m) => {
        const opcionId = getOpcionId(m);
        const okTipo = filtroTipo === 'todos' ? true : opcionId === filtroTipo;
        const okFechaDesde = !fechaDesde || m.fecha >= fechaDesde;
        const okFechaHasta = !fechaHasta || m.fecha <= fechaHasta;
        return okTipo && okFechaDesde && okFechaHasta;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  }, [movs, filtroTipo, fechaDesde, fechaHasta]);

  const exportCSV = () => {
    const rows = visibles.map((m) => {
      return {
        fecha: m.fecha,
        sentido: getSentido(m),
        tipo_movimiento: getOpcionNombre(m),
        medio_pago: getMedioNombre(m),
        monto: m.monto,
        usuario: m.created_by_nombre ?? m.usuario_creador_id ?? '',
        nombre_cliente: m.nombre_cliente ?? '',
        nota: m.nota ?? '',
      };
    });
    const defaultRow = { fecha: '', sentido: '', tipo_movimiento: '', medio_pago: '', monto: '', usuario: '', nombre_cliente: '', nota: '' };
    const header = Object.keys(rows[0] ?? defaultRow);
    const csv = [header.join(','), ...rows.map((r) => header.map((h) => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimientos_${hoy}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isDesktop) {
    return (
      <div className="desktop-content">
        <header className="desktop-content-header">
          <h1 className="desktop-content-title">Movimientos</h1>
        </header>

        <div className="list-filters">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="list-filter-input"
            placeholder="Desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="list-filter-input"
            placeholder="Hasta"
          />
          <button onClick={exportCSV} className="list-btn-export">
            Exportar CSV
          </button>
        </div>

        <div className="desktop-content-main">
          <div className="list-items">
            {visibles.map((m) => {
              const sentido = getSentido(m);
              return (
                <Link key={m.id} href={`/movimiento/${m.id}`} className="list-item">
                  <div className="list-item-header">
                    <span className="list-item-title">{getOpcionNombre(m)}</span>
                    <span className={sentido === 'ingreso' ? 'list-item-amount-ingreso' : 'list-item-amount-egreso'}>
                      {sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
                    </span>
                  </div>
                  <div className="list-item-details">
                    <span>{m.fecha}</span>
                    <span>·</span>
                    <span>{getMedioNombre(m)}</span>
                    {m.nombre_cliente && (
                      <>
                        <span>·</span>
                        <span>{m.nombre_cliente}</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
            {visibles.length === 0 && (
              <p className="list-empty">Sin movimientos con estos filtros.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <>
      <header className="list-header">
        <h1 className="title-primary">Movimientos</h1>
      </header>

      <main className="list-main">
        {/* Filtros */}
        <div className="list-filters">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="list-filter-input"
            placeholder="Desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="list-filter-input"
            placeholder="Hasta"
          />
          <button onClick={exportCSV} className="list-btn-export">
            CSV
          </button>
        </div>

        {/* Lista de movimientos */}
        <div className="list-items">
          {visibles.map((m) => {
            const sentido = getSentido(m);
            return (
              <Link key={m.id} href={`/movimiento/${m.id}`} className="list-item">
                <div className="list-item-header">
                  <span className="list-item-title">{getOpcionNombre(m)}</span>
                  <span className={sentido === 'ingreso' ? 'list-item-amount-ingreso' : 'list-item-amount-egreso'}>
                    {sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
                  </span>
                </div>
                <div className="list-item-details">
                  <span>{m.fecha}</span>
                  <span>·</span>
                  <span>{getMedioNombre(m)}</span>
                  {m.nombre_cliente && (
                    <>
                      <span>·</span>
                      <span>{m.nombre_cliente}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
          {visibles.length === 0 && (
            <p className="list-empty">Sin movimientos con estos filtros.</p>
          )}
        </div>
      </main>
    </>
  );
}

export default function MovimientosPage() {
  return (
    <AppLayout mobileContainerClass="list-container">
      <MovimientosContent />
    </AppLayout>
  );
}
