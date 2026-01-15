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
  
  // Helpers for backwards compatibility with enriched data
  const getSentido = (m: any) => m.categoria_sentido ?? m.sentido ?? 'ingreso';
  const getOpcionNombre = (m: any, tipo: any) => m.opcion_nombre ?? tipo?.nombre ?? 'Movimiento';
  const getMedioNombre = (m: any, medio: any) => m.medio_pago_nombre ?? medio?.nombre ?? m.medio_pago_id ?? '-';
  
  return (
    <section className="legacy-section">
      <h3 className="legacy-section-title">Movimientos</h3>

      <div className="page-divider" />

      <div className="legacy-grid">
        {movimientos.map((m) => {
          const tipo = tipoById(m.opcion_id ?? m.tipo_movimiento_id);
          const medio = medioById(m.medio_pago_id);
          const sentido = getSentido(m);
          return (
            <Link key={m.id} href={`/movimiento/${m.id}`} className="legacy-card">
              <div className="legacy-card-header">
                <strong className="legacy-card-title">{getOpcionNombre(m, tipo)}</strong>
                <span className={sentido === 'ingreso' ? 'legacy-amount-ingreso' : 'legacy-amount-egreso'}>
                  ${m.monto.toLocaleString()}
                </span>
              </div>
              <div className="legacy-card-details">
                <span>{m.fecha}</span>
                <span>·</span>
                <span>{getMedioNombre(m, medio)}</span>
                {m.nombre_cliente && (
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
