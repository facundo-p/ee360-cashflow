// Acceso a datos de usuarios usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { UsuarioDTO } from '../dto/usuarios.dto';

export const UsuariosRepo = {
  /**
   * Lista todos los usuarios.
   */
  list: async (): Promise<UsuarioDTO[]> => {
    return Store.usuarios.list();
  },

  /**
   * Busca un usuario por ID.
   */
  findById: async (id: string): Promise<UsuarioDTO | null> => {
    return Store.usuarios.findById(id);
  },

  /**
   * Busca un usuario por email.
   */
  findByEmail: async (email: string): Promise<UsuarioDTO | null> => {
    return Store.usuarios.findByEmail(email);
  },

  /**
   * Verifica credenciales de usuario.
   * En el modo mock, cualquier password es válido si el email existe.
   */
  verifyCredentials: async (email: string, _password: string): Promise<UsuarioDTO | null> => {
    const user = Store.usuarios.findByEmail(email);
    if (!user || user.estado !== 'activo') {
      return null;
    }
    // In mock mode, any password works
    return user;
  },
};
