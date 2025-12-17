// Totales del día: ingresos, egresos, balance. Sticky en listado.
import React from 'react';

type Props = { ingresos: number; egresos: number; balance: number };

export function TotalesDia({ ingresos, egresos, balance }: Props) {
  return (
    <section className="card sticky">
      <h3 style={{ margin: '4px 0' }}>Totales del día</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--color-ingreso)', fontWeight: 600 }}>
          Ingresos: ${ingresos.toLocaleString()}
        </span>
        <span style={{ color: 'var(--color-egreso)', fontWeight: 600 }}>
          Egresos: ${egresos.toLocaleString()}
        </span>
        <strong
          style={{
            color: balance >= 0 ? 'var(--color-ingreso)' : 'var(--color-egreso)',
          }}
        >
          Balance: ${balance.toLocaleString()}
        </strong>
      </div>
    </section>
  );
}


