// Totales del día: ingresos, egresos, balance. Sticky en listado.
import React from 'react';

type Props = { ingresos: number; egresos: number; balance: number };

export function TotalesDia({ ingresos, egresos, balance }: Props) {
  const balanceClass = balance >= 0 ? 'legacy-totales-balance-positive' : 'legacy-totales-balance-negative';
  return (
    <section className="legacy-totales">
      <h3 className="legacy-totales-title">Totales del día</h3>
      <div className="legacy-divider" />
      <div className="legacy-totales-row">
        <span className="legacy-totales-ingreso">
          Ingresos: ${ingresos.toLocaleString()}
        </span>
        <span className="legacy-totales-egreso">
          Egresos: ${egresos.toLocaleString()}
        </span>
        <strong className={`legacy-totales-balance ${balanceClass}`}>
          Balance: ${balance.toLocaleString()}
        </strong>
      </div>
    </section>
  );
}


