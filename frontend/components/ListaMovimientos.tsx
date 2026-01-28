// Lista de movimientos: scroll infinito móvil, tabla en desktop; tap para editar.
import React from 'react';
import Link from 'next/link';

type Props = {
  movimientos: any[];
  tipos: any[];
  medios: any[];
};

export default function ListaMovimientos({ movimientos, tipos, medios }: Props) {
  const medioById = (id: string) => medios.find((m) => m.id === id);
  
  // Helpers for backwards compatibility with enriched data
  const getSentido = (m: any) => m.categoria_sentido ?? m.sentido ?? 'ingreso';
  const getCategoriaNombre = (m: any) => m.categoria_nombre ?? 'Movimiento';
  const getMedioNombre = (m: any, medio: any) => m.medio_pago_nombre ?? medio?.nombre ?? m.medio_pago_id ?? '-';
  
  return (
    <section className="legacy-section">
      <h3 className="legacy-section-title">Movimientos</h3>

      <div className="page-divider" />

      <div className="legacy-grid">
        {movimientos.map((m) => {
          const medio = medioById(m.medio_pago_id);
          const sentido = getSentido(m);
          return (
            <Link key={m.id} href={`/movimiento/${m.id}`} className="legacy-card">
              <div className="legacy-card-header">
                <strong className="legacy-card-title">{getCategoriaNombre(m)}</strong>
                <span className={sentido === 'ingreso' ? 'legacy-amount-ingreso' : 'legacy-amount-egreso'}>
                  ${m.monto.toLocaleString()}
                </span>
              </div>
              <div className="legacy-card-details">
                <span>{m.fecha}</span>
                <span>·</span>
                {m.nombre_cliente && (
                  <>
                    <span>·</span>
                    <span>Cliente: {m.nombre_cliente}</span>
                  </>
                )}
                <span className='legacy-card-detail-right'>{getMedioNombre(m, medio)}</span>
              </div>
            </Link>
          );
        })}
        {movimientos.length === 0 && <p className="legacy-empty">Sin movimientos con estos filtros.</p>}
      </div>
    </section>
  );
}
