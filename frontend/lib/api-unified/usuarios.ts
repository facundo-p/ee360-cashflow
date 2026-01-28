// Unified Usuarios API según AUTH_AND_USERS.md
// Switches between mock and real implementation based on config

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Re-export types
export type { Usuario, Rol, UsuarioCreate, UsuarioUpdate } from '../api/usuarios';

// Lazy imports
let mockApi: typeof import('../api-mock/usuarios') | null = null;
let realApi: typeof import('../api/usuarios') | null = null;

async function getMockApi() {
  if (!mockApi) {
    mockApi = await import('../api-mock/usuarios');
  }
  return mockApi;
}

async function getRealApi() {
  if (!realApi) {
    realApi = await import('../api/usuarios');
  }
  return realApi;
}

// Listar usuarios
export async function listUsuarios(soloActivos = false) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const users = await api.listUsuarios();
    // Map mock users to new format
    return users.map((u: any) => ({
      id: u.id,
      nombre: u.nombre,
      username: u.email,
      rol: u.rol === 'usuario' ? 'coach' : u.rol,
      activo: u.estado !== 'inactivo',
      created_at: u.created_at || new Date().toISOString(),
      updated_at: u.updated_at || new Date().toISOString(),
    })).filter((u: any) => !soloActivos || u.activo);
  }
  const api = await getRealApi();
  return api.listUsuarios(soloActivos);
}

// Obtener usuario
export async function getUsuario(id: string) {
  if (USE_MOCK_API) {
    const api = await getMockApi();
    const users = await api.listUsuarios();
    const user = users.find((u: any) => u.id === id);
    if (!user) throw new Error('Usuario no encontrado');
    return {
      id: user.id,
      nombre: user.nombre,
      username: user.email,
      rol: user.rol === 'usuario' ? 'coach' : user.rol,
      activo: user.estado !== 'inactivo',
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString(),
    };
  }
  const api = await getRealApi();
  return api.getUsuario(id);
}

// Crear usuario
export async function createUsuario(data: { nombre: string; username: string; password: string; rol: 'admin' | 'coach' }) {
  if (USE_MOCK_API) {
    // Mock no soporta crear usuarios
    throw new Error('Mock API no soporta crear usuarios');
  }
  const api = await getRealApi();
  return api.createUsuario(data);
}

// Actualizar usuario
export async function updateUsuario(id: string, data: { nombre?: string; username?: string; rol?: 'admin' | 'coach' }) {
  if (USE_MOCK_API) {
    throw new Error('Mock API no soporta actualizar usuarios');
  }
  const api = await getRealApi();
  return api.updateUsuario(id, data);
}

// Cambiar password
export async function changePassword(id: string, password: string) {
  if (USE_MOCK_API) {
    throw new Error('Mock API no soporta cambiar password');
  }
  const api = await getRealApi();
  return api.changePassword(id, password);
}

// Activar usuario
export async function activarUsuario(id: string) {
  if (USE_MOCK_API) {
    throw new Error('Mock API no soporta activar usuarios');
  }
  const api = await getRealApi();
  return api.activarUsuario(id);
}

// Desactivar usuario
export async function desactivarUsuario(id: string) {
  if (USE_MOCK_API) {
    throw new Error('Mock API no soporta desactivar usuarios');
  }
  const api = await getRealApi();
  return api.desactivarUsuario(id);
}
