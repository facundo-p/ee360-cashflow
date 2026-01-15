// Lógica de negocio de usuarios.
// Reglas según business-rules.md sección 5.

import { UsuariosRepo } from '../repositories/usuarios.repo';
import { UsuarioDTO } from '../dto/usuarios.dto';

// Errores de dominio
export class UsuarioError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'DUPLICATE_EMAIL' | 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'UsuarioError';
  }
}

export const UsuariosService = {
  /**
   * Lista todos los usuarios.
   * Regla 5.1: Solo admin puede listar usuarios.
   * (La validación de rol se hace en el controller/middleware)
   */
  list: async (): Promise<UsuarioDTO[]> => {
    return UsuariosRepo.list();
  },

  /**
   * Obtiene un usuario por ID.
   */
  get: async (id: string): Promise<UsuarioDTO> => {
    const usuario = await UsuariosRepo.findById(id);
    if (!usuario) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
    return usuario;
  },

  /**
   * Obtiene un usuario por email.
   */
  getByEmail: async (email: string): Promise<UsuarioDTO> => {
    const usuario = await UsuariosRepo.findByEmail(email);
    if (!usuario) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
    return usuario;
  },
};