// Lógica de negocio de autenticación.

import { UsuariosRepo } from '../repositories/usuarios.repo';
import { signToken, verifyToken } from '../auth/jwt';
import { UsuarioDTO } from '../dto/usuarios.dto';
import { LoginRequest, LoginResponse } from '../dto/auth.dto';

// Errores de dominio
export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_CREDENTIALS' | 'USER_INACTIVE' | 'INVALID_TOKEN'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Payload del token JWT
export type TokenPayload = {
  userId: string;
  email: string;
  rol: 'admin' | 'usuario';
};

export const AuthService = {
  /**
   * Autentica un usuario con email y password.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse & { user: UsuarioDTO }> => {
    // Verificar credenciales
    const usuario = await UsuariosRepo.verifyCredentials(
      credentials.email, 
      credentials.password
    );

    if (!usuario) {
      throw new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== 'activo') {
      throw new AuthError('Usuario inactivo', 'USER_INACTIVE');
    }

    // Generar token
    const tokenPayload: TokenPayload = {
      userId: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };
    const token = signToken(tokenPayload);

    return { token, user: usuario };
  },

  /**
   * Verifica un token y retorna el usuario.
   */
  verifyToken: async (token: string): Promise<UsuarioDTO> => {
    const payload = verifyToken<TokenPayload>(token);
    if (!payload) {
      throw new AuthError('Token inválido', 'INVALID_TOKEN');
    }

    const usuario = await UsuariosRepo.findById(payload.userId);
    if (!usuario) {
      throw new AuthError('Usuario no encontrado', 'INVALID_TOKEN');
    }

    if (usuario.estado !== 'activo') {
      throw new AuthError('Usuario inactivo', 'USER_INACTIVE');
    }

    return usuario;
  },

  /**
   * Obtiene el usuario actual a partir del token.
   */
  me: async (token: string): Promise<UsuarioDTO> => {
    return AuthService.verifyToken(token);
  },
};