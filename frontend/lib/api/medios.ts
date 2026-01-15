// API calls for Medios de Pago
import api from './client';

export type MedioPago = {
  id: string;
  nombre: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export type MedioPagoCreateInput = {
  nombre: string;
  orden?: number;
};

export type MedioPagoUpdateInput = Partial<MedioPagoCreateInput> & {
  activo?: boolean;
};

// List all medios (optionally filter by activo)
export async function listMedios(soloActivos = false): Promise<MedioPago[]> {
  const params = soloActivos ? '?solo_activos=true' : '';
  return api.get<MedioPago[]>(`/medios${params}`);
}

// Get single medio by ID
export async function getMedio(id: string): Promise<MedioPago | null> {
  try {
    return await api.get<MedioPago>(`/medios/${id}`);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Create new medio
export async function createMedio(input: MedioPagoCreateInput): Promise<MedioPago> {
  return api.post<MedioPago>('/medios', input);
}

// Update medio
export async function updateMedio(id: string, updates: MedioPagoUpdateInput): Promise<MedioPago | null> {
  try {
    return await api.put<MedioPago>(`/medios/${id}`, updates);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Toggle activo status
export async function toggleMedioActivo(id: string): Promise<MedioPago | null> {
  try {
    return await api.patch<MedioPago>(`/medios/${id}/toggle`);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Check if medio has dependent opciones
export async function hasDependentOpciones(medioId: string): Promise<boolean> {
  const result = await api.get<{ has_opciones: boolean }>(`/medios/${medioId}/has-opciones`);
  return result.has_opciones;
}
