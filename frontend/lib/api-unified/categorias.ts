// Unified Categorias API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  Categoria, 
  CategoriaCreateInput,
  CategoriaUpdateInput
} from '../api/categorias';

// Also export CategoriaMovimiento for backward compatibility
import type { Categoria } from '../api/categorias';
export type CategoriaMovimiento = Categoria & {
  fecha_creacion?: string;
  fecha_actualizacion?: string;
};

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

export async function listCategorias(soloActivas = false) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listCategorias(soloActivas);
  }
  const api = await getRealApi();
  return api.listCategorias(soloActivas);
}

export async function getCategoria(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getCategoria(id);
  }
  const api = await getRealApi();
  return api.getCategoria(id);
}

export async function createCategoria(input: Parameters<typeof import('../api/categorias').createCategoria>[0]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.createCategoria(input);
  }
  const api = await getRealApi();
  return api.createCategoria(input);
}

export async function updateCategoria(id: string, updates: Parameters<typeof import('../api/categorias').updateCategoria>[1]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.updateCategoria(id, updates);
  }
  const api = await getRealApi();
  return api.updateCategoria(id, updates);
}

export async function toggleCategoriaActivo(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.toggleCategoriaActivo(id);
  }
  const api = await getRealApi();
  return api.toggleCategoriaActivo(id);
}

export async function hasDependentOpciones(categoriaId: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.hasDependentOpciones(categoriaId);
  }
  const api = await getRealApi();
  return api.hasDependentOpciones(categoriaId);
}
