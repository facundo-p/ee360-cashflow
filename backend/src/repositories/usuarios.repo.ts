// Acceso a persistencia de usuarios (stub).
// TODO: Implementar con base de datos real.

import { UsuarioDTO } from '../dto/usuarios.dto';

export const UsuariosRepo = {
  /**
   * Lista todos los usuarios.
   */
  list: async (): Promise<UsuarioDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Busca un usuario por ID.
   */
  findById: async (id: string): Promise<UsuarioDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca un usuario por email.
   */
  findByEmail: async (email: string): Promise<UsuarioDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Verifica credenciales y retorna el usuario si son válidas.
   */
  verifyCredentials: async (email: string, password: string): Promise<UsuarioDTO | null> => {
    // TODO: Implementar persistencia con hash de password
    return null;
  },
};