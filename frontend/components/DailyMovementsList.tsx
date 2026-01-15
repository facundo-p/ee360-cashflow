// DailyMovementsList: lista de movimientos del día
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listMovimientos } from '../lib/api-unified/movimientos';

type Props = {
  compact?: boolean;
  refreshKey?: number;
  limit?: number;
};

export default function DailyMovementsList({ compact = false, refreshKey = 0, limit }: Props) {
  const [movs, setMovs] = useState<any[]>([]);
  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    listMovimientos().then(setMovs);
  }, [refreshKey]);

  const movsHoy = useMemo(() => {
    let filtered = movs
      .filter((m) => m.fecha === hoy)
      .sort((a, b) => b.id.localeCompare(a.id));
    
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }, [movs, hoy, limit]);

  if (compact) {
    return (
      <div className="movements-compact">
        <h2 className="movements-compact-title">Movimientos de Hoy</h2>
        
        {movsHoy.length === 0 ? (
          <p className="movements-compact-empty">Sin movimientos hoy</p>
        ) : (
          <div className="movements-compact-list">
            {movsHoy.map((m) => {
              const sentido = m.categoria_sentido ?? m.sentido ?? 'ingreso';
              return (
                <Link key={m.id} href={`/movimiento/${m.id}`} className="movements-compact-item">
                  <span className="movements-compact-name">{m.opcion_nombre ?? m.tipo_movimiento_id ?? 'Movimiento'}</span>
                  <span className={sentido === 'ingreso' ? 'movements-compact-ingreso' : 'movements-compact-egreso'}>
                    {sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
        
        {movs.filter((m) => m.fecha === hoy).length > (limit ?? Infinity) && (
          <Link href="/movimientos" className="movements-compact-more">
            Ver todos →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="movements-full">
      <div className="list-items">
        {movsHoy.map((m) => {
          const sentido = m.categoria_sentido ?? m.sentido ?? 'ingreso';
          return (
            <Link key={m.id} href={`/movimiento/${m.id}`} className="list-item">
              <div className="list-item-header">
                <span className="list-item-title">{m.opcion_nombre ?? 'Movimiento'}</span>
                <span className={sentido === 'ingreso' ? 'list-item-amount-ingreso' : 'list-item-amount-egreso'}>
                  {sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
                </span>
              </div>
              <div className="list-item-details">
                <span>{m.fecha}</span>
                <span>·</span>
                <span>{m.medio_pago_nombre ?? m.medio_pago_id ?? '-'}</span>
                {m.nombre_cliente && (
                  <>
                    <span>·</span>
                    <span>{m.nombre_cliente}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
        {movsHoy.length === 0 && (
          <p className="list-empty">Sin movimientos hoy.</p>
        )}
      </div>
    </div>
  );
}
