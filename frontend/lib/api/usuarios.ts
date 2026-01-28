// API calls for Usuarios (admin only) según AUTH_AND_USERS.md
import api from './client';

// Tipos según AUTH_AND_USERS.md
export type Rol = 'admin' | 'coach';

export type Usuario = {
  id: string;
  nombre: string;
  username: string;
  rol: Rol;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type UsuarioCreate = {
  nombre: string;
  username: string;
  password: string;
  rol: Rol;
};

export type UsuarioUpdate = {
  nombre?: string;
  username?: string;
  rol?: Rol;
};

// Listar todos los usuarios
export async function listUsuarios(soloActivos = false): Promise<Usuario[]> {
  const query = soloActivos ? '?activos=true' : '';
  return api.get<Usuario[]>(`/usuarios${query}`);
}

// Obtener usuario por ID
export async function getUsuario(id: string): Promise<Usuario> {
  return api.get<Usuario>(`/usuarios/${id}`);
}

// Crear usuario
export async function createUsuario(data: UsuarioCreate): Promise<Usuario> {
  return api.post<Usuario>('/usuarios', data);
}

// Actualizar usuario (sin password)
export async function updateUsuario(id: string, data: UsuarioUpdate): Promise<Usuario> {
  return api.put<Usuario>(`/usuarios/${id}`, data);
}

// Cambiar password
export async function changePassword(id: string, password: string): Promise<void> {
  await api.patch(`/usuarios/${id}/password`, { password });
}

// Activar usuario
export async function activarUsuario(id: string): Promise<Usuario> {
  return api.patch<Usuario>(`/usuarios/${id}/activar`);
}

// Desactivar usuario
export async function desactivarUsuario(id: string): Promise<Usuario> {
  return api.patch<Usuario>(`/usuarios/${id}/desactivar`);
}
