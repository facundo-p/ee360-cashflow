// Devuelve el último medio de pago usado por el usuario si el tipo no define sugerido.
// En este mock, se inspecciona el store en memoria.
import { listMovimientos } from '../lib/api-mock/movimientos';
import { useMemo } from 'react';

export function useUltimoMedio(usuarioId?: string) {
  return useMemo(() => {
    const movs = listMovimientos();
    // listMovimientos es async en interfaz real; aquí es sync mock -> adapt.
    // @ts-expect-error mock sync
    const resolved = movs instanceof Promise ? [] : movs;
    const filtered = usuarioId ? resolved.filter((m: any) => m.usuario_creador_id === usuarioId) : resolved;
    const last = filtered[0];
    return { medioPagoId: last?.medio_pago_id ?? null, usuarioId };
  }, [usuarioId]);
}


