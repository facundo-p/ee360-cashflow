// API calls for Opciones de Movimiento
import api from './client';

// Types matching backend DTOs
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

export type OpcionEnriquecida = OpcionMovimiento & {
  categoria_nombre: string;
  categoria_sentido: 'ingreso' | 'egreso';
  medio_pago_nombre: string;
};

export type OpcionCreateInput = {
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  icono?: string;
  monto_sugerido?: number | null;
  orden?: number;
};

export type OpcionUpdateInput = Partial<Omit<OpcionCreateInput, 'categoria_id' | 'medio_pago_id'>> & {
  activo?: boolean;
};

// List all opciones
export async function listOpciones(soloActivas = false): Promise<OpcionMovimiento[]> {
  const params = soloActivas ? '?solo_activas=true' : '';
  return api.get<OpcionMovimiento[]>(`/opciones${params}`);
}

// List opciones with enriched data
export async function listOpcionesEnriquecidas(soloActivas = false): Promise<OpcionEnriquecida[]> {
  const params = soloActivas ? '?solo_activas=true&enriquecidas=true' : '?enriquecidas=true';
  return api.get<OpcionEnriquecida[]>(`/opciones${params}`);
}

// Get single opcion by ID
export async function getOpcion(id: string): Promise<OpcionMovimiento | null> {
  try {
    return await api.get<OpcionMovimiento>(`/opciones/${id}`);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Create new opcion
export async function createOpcion(input: OpcionCreateInput): Promise<OpcionMovimiento> {
  return api.post<OpcionMovimiento>('/opciones', input);
}

// Update opcion
export async function updateOpcion(id: string, updates: OpcionUpdateInput): Promise<OpcionMovimiento | null> {
  try {
    return await api.put<OpcionMovimiento>(`/opciones/${id}`, updates);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Toggle activo status
export async function toggleOpcionActivo(id: string): Promise<OpcionMovimiento | null> {
  try {
    return await api.patch<OpcionMovimiento>(`/opciones/${id}/toggle`, {});
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Bulk update prices
export async function aumentarPrecios(porcentaje: number): Promise<{ updated: number }> {
  return api.post<{ updated: number }>('/opciones/aumentar-precios', { porcentaje });
}

// List available icons
export async function listIconosDisponibles(): Promise<string[]> {
  return api.get<string[]>('/opciones/iconos');
}
