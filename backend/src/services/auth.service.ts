// Lógica de negocio de autenticación según AUTH_AND_USERS.md

import bcrypt from 'bcrypt';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { signToken, verifyToken, TokenPayload } from '../auth/jwt';
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

export const AuthService = {
  /**
   * Autentica un usuario con username y password.
   * Retorna token JWT y datos del usuario.
   */
  login: async (
    credentials: LoginRequest
  ): Promise<LoginResponse & { user: UsuarioDTO }> => {
    // Buscar usuario por username (incluye password_hash)
    const usuario = await UsuariosRepo.findByUsernameWithHash(
      credentials.username
    );

    if (!usuario) {
      throw new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new AuthError('Usuario inactivo', 'USER_INACTIVE');
    }

    // Verificar password con bcrypt
    const passwordValid = await bcrypt.compare(
      credentials.password,
      usuario.password_hash
    );

    if (!passwordValid) {
      throw new AuthError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    // Generar token JWT (solo userId y rol según AUTH_AND_USERS.md)
    const tokenPayload: TokenPayload = {
      userId: usuario.id,
      rol: usuario.rol,
    };
    const token = signToken(tokenPayload);

    // Retornar sin password_hash
    const { password_hash, ...userWithoutHash } = usuario;
    return { token, user: userWithoutHash };
  },

  /**
   * Verifica un token y retorna el usuario.
   * Valida: token válido, usuario existe, usuario activo.
   */
  verifyToken: async (token: string): Promise<UsuarioDTO> => {
    const payload = verifyToken(token);
    if (!payload) {
      throw new AuthError('Token inválido', 'INVALID_TOKEN');
    }

    const usuario = await UsuariosRepo.findById(payload.userId);
    if (!usuario) {
      throw new AuthError('Usuario no encontrado', 'INVALID_TOKEN');
    }

    if (!usuario.activo) {
      throw new AuthError('Usuario inactivo', 'USER_INACTIVE');
    }

    return usuario;
  },

  /**
   * Obtiene el usuario actual a partir del token.
   * Endpoint: GET /api/auth/me
   */
  me: async (token: string): Promise<UsuarioDTO> => {
    return AuthService.verifyToken(token);
  },
};
