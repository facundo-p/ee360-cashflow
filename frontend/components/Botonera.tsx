// Botonera: grid de íconos circulares estilo espartano con borde dorado.
import React from 'react';

const DEFAULT_ICON = '/icons/default.png';

type Props = {
  opciones: Array<{
    id: string;
    nombre_display: string;
    sentido: 'ingreso' | 'egreso';
    icono?: string;
  }>;
  onSelect: (id: string) => void;
};

export default function Botonera({ opciones, onSelect }: Props) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_ICON;
  };

  return (
    <section className="botonera-grid">
      {opciones.map((o) => {
        const iconSrc = o.icono ? `/icons/${o.icono}` : DEFAULT_ICON;
        return (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className="btn-spartan"
          >
            <div className="btn-spartan-icon">
              <img src={iconSrc} alt="" onError={handleImageError} />
            </div>
            <span className="btn-spartan-label">{o.nombre_display}</span>
          </button>
        );
      })}
    </section>
  );
}


