// Filtros rápidos: chips para tipo; se pueden extender a fecha/sentido.
import React from 'react';

type Props = {
  tipos: any[];
  filtroTipo: string;
  onTipoChange: (id: string) => void;
  onReset: () => void;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesde: (v: string) => void;
  onFechaHasta: (v: string) => void;
};

export default function FiltrosMovimientos({
  tipos,
  filtroTipo,
  onTipoChange,
  onReset,
  fechaDesde,
  fechaHasta,
  onFechaDesde,
  onFechaHasta,
}: Props) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-white p-3 shadow-soft">
      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-gray-800">
          Tipo de movimiento
          <select
            value={filtroTipo}
            onChange={(e) => onTipoChange(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-medium text-gray-800">
            Desde
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesde(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-gray-800">
            Hasta
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHasta(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-primary hover:opacity-80 transition"
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}


