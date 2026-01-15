// Auth plugin for Fastify
// Provides mock authentication and authorization hooks

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken } from '../auth/jwt';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { UsuarioDTO } from '../dto/usuarios.dto';

// Token payload type
type TokenPayload = {
  userId: string;
  email: string;
  rol: 'admin' | 'usuario';
};

// Extract Bearer token from Authorization header
function extractToken(request: FastifyRequest): string | null {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return null;
  }
  return auth.substring(7);
}

// MOCK: For development, return a mock user if no token
// In production, this should be removed
const MOCK_USER: UsuarioDTO = {
  id: 'mock-user-1',
  nombre: 'Usuario Demo',
  email: 'demo@example.com',
  rol: 'admin', // Change to 'usuario' to test non-admin flows
  estado: 'activo',
};

const USE_MOCK_AUTH = process.env.MOCK_AUTH !== 'false';

/**
 * Authentication hook - validates token and attaches user to request
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = extractToken(request);

  // MOCK MODE: Use mock user if no token and mock auth is enabled
  if (!token && USE_MOCK_AUTH) {
    request.user = MOCK_USER;
    request.log.debug('Using mock user for authentication');
    return;
  }

  if (!token) {
    return reply.status(401).send({
      error: 'Token no proporcionado',
      code: 'NO_TOKEN',
    });
  }

  const payload = verifyToken<TokenPayload>(token);
  if (!payload) {
    return reply.status(401).send({
      error: 'Token inválido',
      code: 'INVALID_TOKEN',
    });
  }

  // Get user from database
  const usuario = await UsuariosRepo.findById(payload.userId);
  if (!usuario) {
    return reply.status(401).send({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  if (usuario.estado !== 'activo') {
    return reply.status(403).send({
      error: 'Usuario inactivo',
      code: 'USER_INACTIVE',
    });
  }

  request.user = usuario;
}

/**
 * Authorization hook - requires admin role
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return reply.status(401).send({
      error: 'No autenticado',
      code: 'NOT_AUTHENTICATED',
    });
  }

  if (request.user.rol !== 'admin') {
    return reply.status(403).send({
      error: 'Se requieren permisos de administrador',
      code: 'ADMIN_REQUIRED',
    });
  }
}

/**
 * Auth plugin - registers decorators and hooks
 */
async function authPlugin(fastify: FastifyInstance): Promise<void> {
  // Decorate request with user (typed in fastify.d.ts)
  fastify.decorateRequest('user', null);

  // Log mock auth status
  if (USE_MOCK_AUTH) {
    fastify.log.warn('⚠️  MOCK_AUTH enabled - using mock user for unauthenticated requests');
  }
}

export default fp(authPlugin, {
  name: 'auth',
});
