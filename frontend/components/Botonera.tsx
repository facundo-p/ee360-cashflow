// Botonera: lista de tipos visibles sin scroll; destaca ingreso/egreso y último usado.
import React from 'react';

type Props = {
  tipos: Array<{
    id: string;
    nombre: string;
    sentido: 'ingreso' | 'egreso';
  }>;
  onSelect: (id: string) => void;
};

export default function Botonera({ tipos, onSelect }: Props) {
  return (
    <section className="grid gap-3">
      <div className="grid gap-3 grid-cols-2">
        {tipos.map((t) => {
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`rounded-xl border border-border px-4 py-5 text-left font-semibold shadow-soft transition hover:opacity-90 ${
                t.sentido === 'egreso' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
              }`}
            >
              {t.nombre}
            </button>
          );
        })}
      </div>
    </section>
  );
}


