// Listado / ver movimientos con totales sticky y filtros rápidos.
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { TotalesDia } from '../components/TotalesDia';
import FiltrosMovimientos from '../components/FiltrosMovimientos';
import ListaMovimientos from '../components/ListaMovimientos';
import { listMovimientos } from '../lib/api-mock/movimientos';
import { listTipos } from '../lib/api-mock/tipos';
import { listMedios } from '../lib/api-mock/medios';
import { getTotalesDelDia } from '../lib/api-mock/store';
import { useSessionMock } from '../hooks/useSessionMock';

export default function MovimientosPage() {
  const router = useRouter();
  const { user } = useSessionMock();
  const [movs, setMovs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [medios, setMedios] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const hoy = new Date().toISOString().slice(0, 10);
  const [fechaDesde, setFechaDesde] = useState<string>(hoy);
  const [fechaHasta, setFechaHasta] = useState<string>(hoy);

  useEffect(() => {
    listMovimientos().then(setMovs);
    listTipos().then(setTipos);
    listMedios().then(setMedios);
  }, []);

  const visibles = useMemo(() => {
    return movs.filter((m) => {
      const okTipo = filtroTipo === 'todos' ? true : m.tipo_movimiento_id === filtroTipo;
      const okFecha = (!fechaDesde || m.fecha >= fechaDesde) && (!fechaHasta || m.fecha <= fechaHasta);
      return okTipo && okFecha;
    });
  }, [movs, filtroTipo, fechaDesde, fechaHasta]);

  const totalesFiltrados = useMemo(() => {
    const tot = getTotalesDelDia(hoy);
    const subset = visibles;
    const ingresos = subset.filter((m) => m.sentido === 'ingreso').reduce((a, b) => a + (b.monto ?? 0), 0);
    const egresos = subset.filter((m) => m.sentido === 'egreso').reduce((a, b) => a + (b.monto ?? 0), 0);
    return { ingresos, egresos, balance: ingresos - egresos, fecha: tot.fecha ?? hoy };
  }, [visibles, hoy]);

  return (
    <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary hover:opacity-80 transition"
          onClick={() => router.push('/home')}
        >
          ← Volver a botonera
        </button>
        {user?.rol === 'admin' && (
          <button
            type="button"
            className="ml-auto rounded-lg bg-primary text-white px-3 py-2 text-sm font-semibold hover:opacity-90 transition"
            onClick={() => {
              // Export mock: genera CSV del subset filtrado.
              const rows = visibles.map((m) => {
                const tipo = tipos.find((t) => t.id === m.tipo_movimiento_id);
                const medio = medios.find((md) => md.id === m.medio_pago_id);
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
              const header = Object.keys(rows[0] ?? { fecha: '', sentido: '', tipo_movimiento: '', medio_pago: '', monto: '', usuario: '', nombre_cliente: '', nota: '' });
              const csv = [header.join(','), ...rows.map((r) => header.map((h) => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'movimientos.csv';
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Exportar CSV
          </button>
        )}
      </div>
      <TotalesDia ingresos={totalesFiltrados.ingresos} egresos={totalesFiltrados.egresos} balance={totalesFiltrados.balance} />
      <FiltrosMovimientos
        tipos={tipos}
        filtroTipo={filtroTipo}
        onTipoChange={(id) => setFiltroTipo(id)}
        onReset={() => setFiltroTipo('todos')}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onFechaDesde={setFechaDesde}
        onFechaHasta={setFechaHasta}
      />
      <ListaMovimientos movimientos={visibles} tipos={tipos} medios={medios} />
    </main>
  );
}


