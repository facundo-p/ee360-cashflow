// Unified Movimientos API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  Movimiento, 
  MovimientoEnriquecido, 
  MovimientoCreateInput,
  MovimientoUpdateInput,
  MovimientoFiltros,
  CreateMovimientoResult 
} from '../api/movimientos';

// Import compatible type from mock for backward compatibility
import type { CreateMovimientoResult as MockCreateResult } from '../api-mock/store';

// Lazy imports
let mockApi: typeof import('../api-mock/movimientos') | null = null;
let realApi: typeof import('../api/movimientos') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/movimientos');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/movimientos');
  }
  return realApi;
}

export async function listMovimientos(filtros?: Parameters<typeof import('../api/movimientos').listMovimientos>[0]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    // Transform mock filters to match API
    return api.listMovimientos(filtros);
  }
  const api = await getRealApi();
  return api.listMovimientos(filtros);
}

export async function getMovimiento(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.getMovimiento(id);
  }
  const api = await getRealApi();
  return api.getMovimiento(id);
}

export async function createMovimiento(input: Parameters<typeof import('../api/movimientos').createMovimiento>[0]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const result = await api.createMovimiento(input) as MockCreateResult;
    // Map mock result to unified format
    return {
      movimiento: result.movimiento,
      created: result.created,
      warning: result.warning,
      movimiento_duplicado_id: result.movimiento_duplicado_id,
      requires_confirmation: result.requires_confirmation,
    };
  }
  const api = await getRealApi();
  return api.createMovimiento(input);
}

export async function updateMovimiento(id: string, updates: Parameters<typeof import('../api/movimientos').updateMovimiento>[1]) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    return api.updateMovimiento(id, updates);
  }
  const api = await getRealApi();
  return api.updateMovimiento(id, updates);
}
