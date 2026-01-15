// Unified Opciones API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  OpcionMovimiento, 
  OpcionEnriquecida,
  OpcionCreateInput,
  OpcionUpdateInput
} from '../api/opciones';

// Lazy imports
let mockApi: typeof import('../api-mock/opciones') | null = null;
let realApi: typeof import('../api/opciones') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/opciones');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/opciones');
  }
  return realApi;
}

export async function listOpciones(soloActivas = false) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listOpciones(soloActivas);
  }
  const api = await getRealApi();
  return api.listOpciones(soloActivas);
}

export async function listOpcionesEnriquecidas(soloActivas = false) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listOpcionesEnriquecidas();
  }
  const api = await getRealApi();
  return api.listOpcionesEnriquecidas(soloActivas);
}

export async function getOpcion(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getOpcion(id);
  }
  const api = await getRealApi();
  return api.getOpcion(id);
}

export async function createOpcion(input: Parameters<typeof import('../api/opciones').createOpcion>[0]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.createOpcion(input as any);
  }
  const api = await getRealApi();
  return api.createOpcion(input);
}

export async function updateOpcion(id: string, updates: Parameters<typeof import('../api/opciones').updateOpcion>[1]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.updateOpcion(id, updates as any);
  }
  const api = await getRealApi();
  return api.updateOpcion(id, updates);
}

export async function toggleOpcionActivo(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.toggleOpcionActivo(id);
  }
  const api = await getRealApi();
  return api.toggleOpcionActivo(id);
}

export async function listIconosDisponibles() {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listIconosDisponibles();
  }
  const api = await getRealApi();
  return api.listIconosDisponibles();
}

export async function aumentarPrecios(porcentaje: number) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const result = await api.aumentarPrecios(porcentaje);
    return { updated: result.length };
  }
  const api = await getRealApi();
  return api.aumentarPrecios(porcentaje);
}
