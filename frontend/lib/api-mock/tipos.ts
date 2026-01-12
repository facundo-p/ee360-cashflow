// Endpoints mock de tipos de movimiento - ahora usa el modelo normalizado
// Mantiene compatibilidad con componentes existentes
import { mockDelay } from './client';
import { listOpcionesEnriquecidas } from './opciones';

// Tipo compatible con el modelo anterior (para Botonera y FormMovimiento)
export type TipoMovimiento = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  icono: string;
  monto_sugerido: number | null;
  medio_pago_id: string;
  es_plan: boolean;
  activo: boolean;
};

// Convierte OpcionMovimiento enriquecida al formato legacy
export async function listTipos(): Promise<TipoMovimiento[]> {
  await mockDelay();
  const opciones = await listOpcionesEnriquecidas();
  
  return opciones
    .filter((o) => o.activo)
    .map((o) => ({
      id: o.id,
      nombre: o.nombre_display,
      sentido: o.sentido as 'ingreso' | 'egreso',
      icono: o.icono,
      monto_sugerido: o.monto_sugerido,
      medio_pago_id: o.medio_pago_id,
      es_plan: o.es_plan,
      activo: o.activo,
    }))
    .sort((a, b) => {
      // Get original orden from opciones
      const ordenA = opciones.find((o) => o.id === a.id)?.orden ?? 99;
      const ordenB = opciones.find((o) => o.id === b.id)?.orden ?? 99;
      return ordenA - ordenB;
    });
}

// Obtener un tipo por ID
export async function getTipo(id: string): Promise<TipoMovimiento | null> {
  const tipos = await listTipos();
  return tipos.find((t) => t.id === id) ?? null;
}
