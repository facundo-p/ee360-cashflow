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
    <section className="legacy-filters">
      <div className="legacy-filters-grid">
        <label className="legacy-filters-label">
          Tipo de movimiento
          <select
            value={filtroTipo}
            onChange={(e) => onTipoChange(e.target.value)}
            className="form-select"
          >
            <option value="todos">Todos</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className="legacy-filters-row">
          <label className="legacy-filters-label">
            Desde
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesde(e.target.value)}
              className="form-input"
            />
          </label>
          <label className="legacy-filters-label">
            Hasta
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHasta(e.target.value)}
              className="form-input"
            />
          </label>
        </div>

        <div className="legacy-filters-actions">
          <button type="button" onClick={onReset} className="legacy-filters-reset">
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}


