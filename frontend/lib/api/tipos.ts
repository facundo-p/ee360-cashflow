// API calls for Tipos de Movimiento
// This is a compatibility layer that transforms opciones to the legacy "tipos" format

import { listOpcionesEnriquecidas, OpcionEnriquecida } from './opciones';

// Legacy type used by Botonera and FormMovimiento
export type OpcionMovimiento = {
  id: string;
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  icono: string;
  monto_sugerido: number | null;
  activo: boolean;
  orden: number;
  fecha_actualizacion_precio: string | null;
  created_at: string;
  updated_at: string;
};

// Enriched opcion type from backend
type OpcionEnriquecidaWithEsPlan = OpcionEnriquecida & {
  es_plan?: boolean;
};

// Transform enriched opcion to legacy tipo format
function opcionToTipo(opcion: OpcionEnriquecidaWithEsPlan): OpcionMovimiento {
  return {
    id: opcion.id,
    categoria_id: opcion.categoria_id,
    medio_pago_id: opcion.medio_pago_id,
    nombre_display: opcion.nombre_display,
    icono: opcion.icono,
    monto_sugerido: opcion.monto_sugerido,
    activo: opcion.activo,
    orden: opcion.orden,
    fecha_actualizacion_precio: opcion.fecha_actualizacion_precio,
    created_at: opcion.created_at,
    updated_at: opcion.updated_at,
  };
}

// List all tipos (active opciones transformed to legacy format)
export async function listOpciones(): Promise<OpcionMovimiento[]> {
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
export async function getTipo(id: string): Promise<OpcionMovimiento | null> {
  const tipos = await listOpciones();
  return tipos.find(t => t.id === id) ?? null;
}
