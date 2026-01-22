// Endpoints mock de tipos de movimiento - ahora usa el modelo normalizado
// Mantiene compatibilidad con componentes existentes
import { mockDelay } from './client';
import { listOpcionesEnriquecidas } from './opciones';

// Tipo para opciones transformadas a formato compatible
export type OpcionMovimiento = {
  id: string;
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  nombre: string;  // alias de nombre_display para compatibilidad
  sentido: 'ingreso' | 'egreso';
  icono: string;
  monto_sugerido: number | null;
  es_plan: boolean;
  activo: boolean;
  orden: number;
  fecha_actualizacion_precio: string | null;
  created_at: string;
  updated_at: string;
};

// Legacy type alias
export type TipoMovimiento = OpcionMovimiento;

export async function listOpciones(): Promise<OpcionMovimiento[]> {
  await mockDelay();
  const opciones = await listOpcionesEnriquecidas();
  
  return opciones
    .filter((o) => o.activo)
    .map((o) => ({
      id: o.id,
      categoria_id: o.categoria_id,
      medio_pago_id: o.medio_pago_id,
      nombre_display: o.nombre_display,
      nombre: o.nombre_display, // alias
      sentido: o.sentido as 'ingreso' | 'egreso',
      icono: o.icono,
      monto_sugerido: o.monto_sugerido,
      orden: o.orden,
      fecha_actualizacion_precio: o.fecha_actualizacion_precio,
      created_at: o.created_at,
      updated_at: o.updated_at,
      es_plan: o.es_plan,
      activo: o.activo,
    }))
    .sort((a, b) => a.orden - b.orden);
}

// Obtener un tipo por ID
export async function getTipo(id: string): Promise<TipoMovimiento | null> {
  const tipos = await listOpciones();
  return tipos.find((t) => t.id === id) ?? null;
}
