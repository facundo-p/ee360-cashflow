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
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Movimientos</h3>
      <div className="grid gap-3">
        {movimientos.map((m) => {
          const tipo = tipoById(m.tipo_movimiento_id);
          const medio = medioById(m.medio_pago_id);
          return (
            <Link
              key={m.id}
              href={`/movimiento/${m.id}`}
              className="block rounded-xl border border-border bg-white p-3 shadow-soft hover:opacity-90 transition"
            >
              <div className="flex justify-between items-center">
                <strong className="text-gray-900">{tipo?.nombre ?? 'Tipo'}</strong>
                <span className={m.sentido === 'ingreso' ? 'text-ingreso font-semibold' : 'text-egreso font-semibold'}>
                  ${m.monto.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-600 flex gap-2 flex-wrap">
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
        {movimientos.length === 0 && <p className="text-sm text-gray-600">Sin movimientos con estos filtros.</p>}
      </div>
    </section>
  );
}


