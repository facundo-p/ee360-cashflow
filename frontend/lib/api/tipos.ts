// API calls for Tipos de Movimiento
// This is a compatibility layer that transforms opciones to the legacy "tipos" format

import { listOpcionesEnriquecidas, OpcionEnriquecida } from './opciones';

// Legacy type used by Botonera and FormMovimiento
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

// Enriched opcion type from backend
type OpcionEnriquecidaWithEsPlan = OpcionEnriquecida & {
  es_plan?: boolean;
};

// Transform enriched opcion to legacy tipo format
function opcionToTipo(opcion: OpcionEnriquecidaWithEsPlan): TipoMovimiento {
  return {
    id: opcion.id,
    nombre: opcion.nombre_display,
    sentido: opcion.categoria_sentido,
    icono: opcion.icono,
    monto_sugerido: opcion.monto_sugerido,
    medio_pago_id: opcion.medio_pago_id,
    es_plan: opcion.es_plan ?? false,
    activo: opcion.activo,
  };
}

// List all tipos (active opciones transformed to legacy format)
export async function listTipos(): Promise<TipoMovimiento[]> {
  const opciones = await listOpcionesEnriquecidas(true); // solo activas
  
  // We need to get es_plan from categorias - the backend enriches with categoria_sentido but not es_plan
  // For now, we'll add a workaround: assume plans have certain categoria names
  // TODO: Update backend to include es_plan in enriched response
  
  return opciones
    .map(opcion => opcionToTipo({
      ...opcion,
      // Heuristic: plans contain "plan" or "clase" in categoria name
      es_plan: opcion.categoria_nombre.toLowerCase().includes('plan') || 
               opcion.categoria_nombre.toLowerCase().includes('clase'),
    }))
    .sort((a, b) => {
      const ordenA = opciones.find(o => o.id === a.id)?.orden ?? 99;
      const ordenB = opciones.find(o => o.id === b.id)?.orden ?? 99;
      return ordenA - ordenB;
    });
}

// Get single tipo by ID
export async function getTipo(id: string): Promise<TipoMovimiento | null> {
  const tipos = await listTipos();
  return tipos.find(t => t.id === id) ?? null;
}
