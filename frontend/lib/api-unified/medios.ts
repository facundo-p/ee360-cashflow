// Unified Medios API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  MedioPago, 
  MedioPagoCreateInput,
  MedioPagoUpdateInput
} from '../api/medios';

// Lazy imports
let mockApi: typeof import('../api-mock/medios') | null = null;
let realApi: typeof import('../api/medios') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/medios');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/medios');
  }
  return realApi;
}

export async function listMedios(soloActivos = false) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listMedios(soloActivos);
  }
  const api = await getRealApi();
  return api.listMedios(soloActivos);
}

export async function getMedio(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getMedio(id);
  }
  const api = await getRealApi();
  return api.getMedio(id);
}

export async function createMedio(input: Parameters<typeof import('../api/medios').createMedio>[0]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.createMedio(input);
  }
  const api = await getRealApi();
  return api.createMedio(input);
}

export async function updateMedio(id: string, updates: Parameters<typeof import('../api/medios').updateMedio>[1]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.updateMedio(id, updates);
  }
  const api = await getRealApi();
  return api.updateMedio(id, updates);
}

export async function toggleMedioActivo(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.toggleMedioActivo(id);
  }
  const api = await getRealApi();
  return api.toggleMedioActivo(id);
}

export async function hasDependentOpciones(medioId: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.hasDependentOpciones(medioId);
  }
  const api = await getRealApi();
  return api.hasDependentOpciones(medioId);
}
