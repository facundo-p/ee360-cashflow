// Unified Auth API
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Import types from the real API
export type { 
  Usuario, 
  LoginInput,
  LoginResult
} from '../api/auth';

// Lazy imports
let mockApi: typeof import('../api-mock/auth') | null = null;
let realApi: typeof import('../api/auth') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/auth');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/auth');
  }
  return realApi;
}

export async function login(credentials: { email: string; password: string }) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const result = await api.login(credentials.email, credentials.password);
    if (!result) {
      throw new Error('Invalid credentials');
    }
    // Map mock result to unified format
    return {
      token: result.token,
      user: {
        id: result.user.id,
        nombre: result.user.nombre,
        email: result.user.email,
        rol: result.user.rol as 'admin' | 'usuario',
        estado: 'activo' as const,
      }
    };
  }
  const api = await getRealApi();
  return api.login(credentials);
}

export function logout() {
  if (USE_MOCK_API) {
    // Mock doesn't have a specific logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_session');
    }
    return;
  }
  // Real API logout is sync
  import('../api/auth').then(api => api.logout());
}

export async function getCurrentUser() {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const user = await api.getCurrentUser();
    if (!user) return null;
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol as 'admin' | 'usuario',
      estado: 'activo' as const,
    };
  }
  const api = await getRealApi();
  return api.getCurrentUser();
}

export function isLoggedIn() {
  if (USE_MOCK_API) {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('mock_session');
  }
  const { getAuthToken } = require('../api/auth');
  return !!getAuthToken();
}
