// Listado de movimientos con estilo espartano, filtros y exportación CSV.
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listMovimientos } from '../lib/api-mock/movimientos';
import { listTipos } from '../lib/api-mock/tipos';
import { listMedios } from '../lib/api-mock/medios';
import BottomNav from '../components/BottomNav';

export default function MovimientosPage() {
  const [movs, setMovs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [medios, setMedios] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const hoy = new Date().toISOString().slice(0, 10);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  useEffect(() => {
    listMovimientos().then(setMovs);
    listTipos().then(setTipos);
    listMedios().then(setMedios);
  }, []);

  const visibles = useMemo(() => {
    return movs
      .filter((m) => {
        const okTipo = filtroTipo === 'todos' ? true : m.tipo_movimiento_id === filtroTipo;
        const okFechaDesde = !fechaDesde || m.fecha >= fechaDesde;
        const okFechaHasta = !fechaHasta || m.fecha <= fechaHasta;
        return okTipo && okFechaDesde && okFechaHasta;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  }, [movs, filtroTipo, fechaDesde, fechaHasta]);

  const tipoById = (id: string) => tipos.find((t) => t.id === id);
  const medioById = (id: string) => medios.find((m) => m.id === id);

  const exportCSV = () => {
    const rows = visibles.map((m) => {
      const tipo = tipoById(m.tipo_movimiento_id);
      const medio = medioById(m.medio_pago_id);
      return {
        fecha: m.fecha,
        sentido: m.sentido,
        tipo_movimiento: tipo?.nombre ?? m.tipo_movimiento_id,
        medio_pago: medio?.nombre ?? m.medio_pago_id,
        monto: m.monto,
        usuario: m.usuario_creador_id,
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

  return (
    <div className="list-container">
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
            const tipo = tipoById(m.tipo_movimiento_id);
            const medio = medioById(m.medio_pago_id);
            return (
              <Link key={m.id} href={`/movimiento/${m.id}`} className="list-item">
                <div className="list-item-header">
                  <span className="list-item-title">{tipo?.nombre ?? 'Tipo'}</span>
                  <span className={m.sentido === 'ingreso' ? 'list-item-amount-ingreso' : 'list-item-amount-egreso'}>
                    {m.sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
                  </span>
                </div>
                <div className="list-item-details">
                  <span>{m.fecha}</span>
                  <span>·</span>
                  <span>{medio?.nombre ?? m.medio_pago_id}</span>
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

      <div className="page-divider" />
      <BottomNav />
    </div>
  );
}


