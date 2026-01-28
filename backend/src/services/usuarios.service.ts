// Lógica de negocio de usuarios.
// Reglas según AUTH_AND_USERS.md

import { UsuariosRepo } from '../repositories/usuarios.repo';
import {
  UsuarioDTO,
  UsuarioCreateDTO,
  UsuarioUpdateDTO,
  Rol,
} from '../dto/usuarios.dto';

// Errores de dominio
export class UsuarioError extends Error {
  constructor(
    message: string,
    public code:
      | 'NOT_FOUND'
      | 'DUPLICATE_USERNAME'
      | 'VALIDATION_ERROR'
      | 'INVALID_EMAIL'
  ) {
    super(message);
    this.name = 'UsuarioError';
  }
}

// Validación de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export const UsuariosService = {
  /**
   * Lista todos los usuarios.
   * Regla: Solo admin puede listar usuarios (validar en controller).
   */
  list: async (soloActivos = false): Promise<UsuarioDTO[]> => {
    return UsuariosRepo.list(soloActivos);
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
   * Obtiene un usuario por username.
   */
  getByUsername: async (username: string): Promise<UsuarioDTO> => {
    const usuario = await UsuariosRepo.findByUsername(username);
    if (!usuario) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
    return usuario;
  },

  /**
   * Crea un nuevo usuario.
   * Valida: username único y formato email válido.
   */
  create: async (payload: UsuarioCreateDTO): Promise<UsuarioDTO> => {
    // Validar formato de email en username
    if (!validateEmail(payload.username)) {
      throw new UsuarioError(
        'El username debe ser un email válido',
        'INVALID_EMAIL'
      );
    }

    // Verificar username único
    const exists = await UsuariosRepo.usernameExists(payload.username);
    if (exists) {
      throw new UsuarioError(
        'El username ya está en uso',
        'DUPLICATE_USERNAME'
      );
    }

    // Validar campos requeridos
    if (!payload.nombre?.trim()) {
      throw new UsuarioError('El nombre es requerido', 'VALIDATION_ERROR');
    }

    if (!payload.password || payload.password.length < 6) {
      throw new UsuarioError(
        'La contraseña debe tener al menos 6 caracteres',
        'VALIDATION_ERROR'
      );
    }

    return UsuariosRepo.create({
      nombre: payload.nombre.trim(),
      username: payload.username.toLowerCase().trim(),
      password: payload.password,
      rol: payload.rol,
    });
  },

  /**
   * Actualiza un usuario existente (sin password).
   */
  update: async (id: string, payload: UsuarioUpdateDTO): Promise<UsuarioDTO> => {
    // Verificar que existe
    const existing = await UsuariosRepo.findById(id);
    if (!existing) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }

    // Validar username si se está cambiando
    if (payload.username !== undefined) {
      if (!validateEmail(payload.username)) {
        throw new UsuarioError(
          'El username debe ser un email válido',
          'INVALID_EMAIL'
        );
      }

      const usernameExists = await UsuariosRepo.usernameExists(
        payload.username,
        id
      );
      if (usernameExists) {
        throw new UsuarioError(
          'El username ya está en uso',
          'DUPLICATE_USERNAME'
        );
      }
    }

    // Validar nombre si se está cambiando
    if (payload.nombre !== undefined && !payload.nombre.trim()) {
      throw new UsuarioError('El nombre no puede estar vacío', 'VALIDATION_ERROR');
    }

    const updated = await UsuariosRepo.update(id, {
      nombre: payload.nombre?.trim(),
      username: payload.username?.toLowerCase().trim(),
      rol: payload.rol,
    });

    if (!updated) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }

    return updated;
  },

  /**
   * Cambia el password de un usuario.
   */
  changePassword: async (id: string, newPassword: string): Promise<void> => {
    // Verificar que existe
    const existing = await UsuariosRepo.findById(id);
    if (!existing) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }

    // Validar password
    if (!newPassword || newPassword.length < 6) {
      throw new UsuarioError(
        'La contraseña debe tener al menos 6 caracteres',
        'VALIDATION_ERROR'
      );
    }

    const success = await UsuariosRepo.changePassword(id, newPassword);
    if (!success) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
  },

  /**
   * Activa un usuario.
   */
  activar: async (id: string): Promise<UsuarioDTO> => {
    const updated = await UsuariosRepo.activar(id);
    if (!updated) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Desactiva un usuario.
   */
  desactivar: async (id: string): Promise<UsuarioDTO> => {
    const updated = await UsuariosRepo.desactivar(id);
    if (!updated) {
      throw new UsuarioError('Usuario no encontrado', 'NOT_FOUND');
    }
    return updated;
  },
};
