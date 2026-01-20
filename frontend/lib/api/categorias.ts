// API calls for Categorías de Movimiento
import api from './client';

export type Categoria = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoriaCreateInput = {
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan?: boolean;
};

export type CategoriaUpdateInput = Partial<Omit<CategoriaCreateInput, 'sentido'>> & {
  activo?: boolean;
};

// List all categorias (optionally filter by activo)
export async function listCategorias(soloActivas = false): Promise<Categoria[]> {
  const params = soloActivas ? '?solo_activas=true' : '';
  return api.get<Categoria[]>(`/categorias${params}`);
}

// Get single categoria by ID
export async function getCategoria(id: string): Promise<Categoria | null> {
  try {
    return await api.get<Categoria>(`/categorias/${id}`);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Create new categoria
export async function createCategoria(input: CategoriaCreateInput): Promise<Categoria> {
  return api.post<Categoria>('/categorias', input);
}

// Update categoria
export async function updateCategoria(id: string, updates: CategoriaUpdateInput): Promise<Categoria | null> {
  try {
    return await api.put<Categoria>(`/categorias/${id}`, updates);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Toggle activo status
export async function toggleCategoriaActivo(id: string): Promise<Categoria | null> {
  try {
    return await api.patch<Categoria>(`/categorias/${id}/toggle`, {});
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Check if categoria has dependent opciones
export async function hasDependentOpciones(categoriaId: string): Promise<boolean> {
  const result = await api.get<{ has_opciones: boolean }>(`/categorias/${categoriaId}/has-opciones`);
  return result.has_opciones;
}
