// API Mock para Opciones de Movimiento con persistencia localStorage
import { opcionesSeed, OpcionMovimiento } from '../../__mocks__/opciones';

const STORAGE_KEY = 'mock_opciones';

function getStoredData(): OpcionMovimiento[] {
  if (typeof window === 'undefined') return opcionesSeed;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : opcionesSeed;
}

function saveData(data: OpcionMovimiento[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// List all opciones (optionally filter by activo)
export async function listOpciones(soloActivas = false): Promise<OpcionMovimiento[]> {
  const data = getStoredData();
  const filtered = soloActivas ? data.filter((o) => o.activo) : data;
  return filtered.sort((a, b) => a.orden - b.orden);
}

// Get single opcion by ID
export async function getOpcion(id: string): Promise<OpcionMovimiento | null> {
  const data = getStoredData();
  return data.find((o) => o.id === id) ?? null;
}

// Create new opcion
export async function createOpcion(
  input: Omit<OpcionMovimiento, 'id' | 'fecha_actualizacion'>
): Promise<OpcionMovimiento> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  const newOpcion: OpcionMovimiento = {
    ...input,
    id: `t-${Date.now()}`, // Usa prefijo 't-' para compatibilidad con movimientos
    fecha_actualizacion: now,
  };
  data.push(newOpcion);
  saveData(data);
  return newOpcion;
}

// Update opcion
export async function updateOpcion(
  id: string,
  updates: Partial<Omit<OpcionMovimiento, 'id'>>
): Promise<OpcionMovimiento | null> {
  const data = getStoredData();
  const index = data.findIndex((o) => o.id === id);
  if (index === -1) return null;
  
  data[index] = {
    ...data[index],
    ...updates,
    fecha_actualizacion: new Date().toISOString().slice(0, 10),
  };
  saveData(data);
  return data[index];
}

// Soft-delete: toggle activo status
export async function toggleOpcionActivo(id: string): Promise<OpcionMovimiento | null> {
  const data = getStoredData();
  const opcion = data.find((o) => o.id === id);
  if (!opcion) return null;
  return updateOpcion(id, { activo: !opcion.activo });
}

// Reorder opciones
export async function reorderOpciones(orderedIds: string[]): Promise<OpcionMovimiento[]> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  
  orderedIds.forEach((id, index) => {
    const opcion = data.find((o) => o.id === id);
    if (opcion) {
      opcion.orden = index + 1;
      opcion.fecha_actualizacion = now;
    }
  });
  
  saveData(data);
  return data.sort((a, b) => a.orden - b.orden);
}

// Bulk update prices (percentage increase)
export async function aumentarPrecios(porcentaje: number): Promise<OpcionMovimiento[]> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  const multiplier = 1 + (porcentaje / 100);
  
  data.forEach((opcion) => {
    if (opcion.monto_sugerido !== null) {
      opcion.monto_sugerido = Math.round(opcion.monto_sugerido * multiplier);
      opcion.fecha_actualizacion = now;
    }
  });
  
  saveData(data);
  return data;
}

// Get available icons from public/icons folder
export async function listIconosDisponibles(): Promise<string[]> {
  // In a real implementation, this would scan the folder
  // For mock, we return a hardcoded list
  return [
    'bebida.png',
    'clase_individual.png',
    'clase_kids.png',
    'default.png',
    'merchandising.png',
    'otros_egreso.png',
    'otros_ingreso.png',
    'plan_kids_1x.png',
    'plan_kids_2x.png',
    'plan_mensual_efectivo.png',
    'plan_mensual_transferencia.png',
    'plan_semestral_efectivo.png',
    'plan_semestral_tarjeta.png',
  ];
}

// Get opciones with enriched data (categoria and medio names)
export async function listOpcionesEnriquecidas(): Promise<
  (OpcionMovimiento & { categoria_nombre: string; medio_nombre: string; sentido: string; es_plan: boolean })[]
> {
  const { listCategorias } = await import('./categorias');
  const { listMedios } = await import('./medios');
  
  const [opciones, categorias, medios] = await Promise.all([
    listOpciones(),
    listCategorias(),
    listMedios(),
  ]);
  
  return opciones.map((o) => {
    const categoria = categorias.find((c) => c.id === o.categoria_id);
    const medio = medios.find((m) => m.id === o.medio_pago_id);
    return {
      ...o,
      categoria_nombre: categoria?.nombre ?? 'Sin categoría',
      medio_nombre: medio?.nombre ?? 'Sin medio',
      sentido: categoria?.sentido ?? 'ingreso',
      es_plan: categoria?.es_plan ?? false,
    };
  });
}
