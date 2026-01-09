// Botonera: grid de íconos circulares estilo espartano con borde dorado.
import React from 'react';

const DEFAULT_ICON = '/icons/default.png';

type Props = {
  tipos: Array<{
    id: string;
    nombre: string;
    sentido: 'ingreso' | 'egreso';
    icono?: string;
  }>;
  onSelect: (id: string) => void;
};

export default function Botonera({ tipos, onSelect }: Props) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_ICON;
  };

  return (
    <section className="botonera-grid">
      {tipos.map((t) => {
        const iconSrc = t.icono ? `/icons/${t.icono}` : DEFAULT_ICON;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="btn-spartan"
          >
            <div className="btn-spartan-icon">
              <img src={iconSrc} alt="" onError={handleImageError} />
            </div>
            <span className="btn-spartan-label">{t.nombre}</span>
          </button>
        );
      })}
    </section>
  );
}


