// Lista de movimientos: scroll infinito móvil, tabla en desktop; tap para editar.
import React from 'react';
import Link from 'next/link';

type Props = {
  movimientos: any[];
  tipos: any[];
  medios: any[];
};

export default function ListaMovimientos({ movimientos, tipos, medios }: Props) {
  const tipoById = (id: string) => tipos.find((t) => t.id === id);
  const medioById = (id: string) => medios.find((m) => m.id === id);
  return (
    <section className="legacy-section">
      <h3 className="legacy-section-title">Movimientos</h3>

      <div className="page-divider" />

      <div className="legacy-grid">
        {movimientos.map((m) => {
          const tipo = tipoById(m.tipo_movimiento_id);
          const medio = medioById(m.medio_pago_id);
          return (
            <Link key={m.id} href={`/movimiento/${m.id}`} className="legacy-card">
              <div className="legacy-card-header">
                <strong className="legacy-card-title">{tipo?.nombre ?? 'Tipo'}</strong>
                <span className={m.sentido === 'ingreso' ? 'legacy-amount-ingreso' : 'legacy-amount-egreso'}>
                  ${m.monto.toLocaleString()}
                </span>
              </div>
              <div className="legacy-card-details">
                <span>{m.fecha}</span>
                <span>·</span>
                <span>{medio?.nombre ?? m.medio_pago_id}</span>
                {tipo?.es_plan && m.nombre_cliente && (
                  <>
                    <span>·</span>
                    <span>Cliente: {m.nombre_cliente}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
        {movimientos.length === 0 && <p className="legacy-empty">Sin movimientos con estos filtros.</p>}
      </div>
    </section>
  );
}


