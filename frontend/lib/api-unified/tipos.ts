// Unified Tipos API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API (they're compatible with mock)
export type { TipoMovimiento } from '../api/tipos';

// Lazy import to avoid loading both implementations
let mockApi: typeof import('../api-mock/tipos') | null = null;
let realApi: typeof import('../api/tipos') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/tipos');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/tipos');
  }
  return realApi;
}

export async function listTipos() {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.listTipos();
  }
  const api = await getRealApi();
  return api.listTipos();
}

export async function getTipo(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getTipo(id);
  }
  const api = await getRealApi();
  return api.getTipo(id);
}
