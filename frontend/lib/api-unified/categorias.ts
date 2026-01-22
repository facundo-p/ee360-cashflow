// Unified Categorias API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  Categoria, 
  CategoriaCreateInput,
  CategoriaUpdateInput
} from '../api/categorias';

// CategoriaMovimiento is an alias for Categoria
import type { Categoria } from '../api/categorias';
export type CategoriaMovimiento = Categoria;

// Lazy imports
let mockApi: typeof import('../api-mock/categorias') | null = null;
let realApi: typeof import('../api/categorias') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/categorias');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/categorias');
  }
  return realApi;
}

export async function listCategorias(soloActivas = false): Promise<Categoria[]> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listCategorias(soloActivas);
  }
  const api = await getRealApi();
  return api.listCategorias(soloActivas);
}

export async function getCategoria(id: string): Promise<Categoria | null> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getCategoria(id);
  }
  const api = await getRealApi();
  return api.getCategoria(id);
}

export async function createCategoria(input: {
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan?: boolean;
  activo?: boolean;
}): Promise<Categoria> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.createCategoria(input);
  }
  const api = await getRealApi();
  return api.createCategoria(input);
}

export async function updateCategoria(id: string, updates: {
  nombre?: string;
  es_plan?: boolean;
  activo?: boolean;
}): Promise<Categoria | null> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.updateCategoria(id, updates);
  }
  const api = await getRealApi();
  return api.updateCategoria(id, updates);
}

export async function toggleCategoriaActivo(id: string): Promise<Categoria | null> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.toggleCategoriaActivo(id);
  }
  const api = await getRealApi();
  return api.toggleCategoriaActivo(id);
}

export async function hasDependentOpciones(categoriaId: string): Promise<boolean> {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.hasDependentOpciones(categoriaId);
  }
  const api = await getRealApi();
  return api.hasDependentOpciones(categoriaId);
}
