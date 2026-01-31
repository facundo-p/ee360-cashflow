// Auth plugin for Fastify según AUTH_AND_USERS.md
// Middleware JWT: valida token, inyecta usuario, bloquea sin token

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken } from '../auth/jwt';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { UsuarioDTO } from '../dto/usuarios.dto';
import { IS_PRODUCTION } from '../../server';

/**
 * MOCK_AUTH: Solo para desarrollo local.
 * - Si MOCK_AUTH=true (o no definido en dev): permite requests sin token usando usuario mock
 * - Si MOCK_AUTH=false: requiere token real (modo producción)
 * - Si IS_PRODUCTION=true: siempre requiere token real
 */
const USE_MOCK_AUTH = !IS_PRODUCTION && process.env.MOCK_AUTH !== 'false';

// Usuario mock para desarrollo (solo cuando USE_MOCK_AUTH=true)
const MOCK_USER: UsuarioDTO = {
  id: 'usr_admin_demo',
  nombre: 'Admin Demo',
  username: 'admin@demo.test',
  rol: 'admin',
  activo: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Extrae el Bearer token del header Authorization
 */
function extractToken(request: FastifyRequest): string | null {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return null;
  }
  return auth.substring(7);
}

/**
 * Middleware de autenticación JWT
 * Según AUTH_AND_USERS.md sección 1 y 3:
 * - Valida token JWT válido
 * - Verifica que el usuario exista
 * - Verifica que el usuario esté activo
 * - Inyecta usuario autenticado en request.user
 * - Bloquea requests sin token (excepto en modo mock para desarrollo)
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = extractToken(request);

  // Sin token
  if (!token) {
    // Modo desarrollo con mock habilitado
    if (USE_MOCK_AUTH) {
      request.user = MOCK_USER;
      request.log.debug('MOCK_AUTH: Using mock user (admin)');
      return;
    }

    // Producción o mock deshabilitado: bloquear
    return reply.status(401).send({
      error: 'Token no proporcionado',
      code: 'NO_TOKEN',
    });
  }

  // Validar JWT
  const payload = verifyToken(token);
  if (!payload) {
    return reply.status(401).send({
      error: 'Token inválido o expirado',
      code: 'INVALID_TOKEN',
    });
  }

  // Buscar usuario en BD
  const usuario = await UsuariosRepo.findById(payload.userId);
  if (!usuario) {
    return reply.status(401).send({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  // Verificar usuario activo (AUTH_AND_USERS.md sección 3.3)
  if (!usuario.activo) {
    return reply.status(403).send({
      error: 'Usuario inactivo',
      code: 'USER_INACTIVE',
    });
  }

  // Inyectar usuario autenticado en request
  request.user = usuario;
}

/**
 * Middleware de autorización: requiere rol admin
 * Según AUTH_AND_USERS.md sección 3.2
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
 * Plugin de autenticación para Fastify
 * Registra decoradores necesarios
 */
async function authPlugin(fastify: FastifyInstance): Promise<void> {
  // Decorar request con user (tipado en fastify.d.ts)
  fastify.decorateRequest('user', undefined as UsuarioDTO | undefined);

  // Log del modo de autenticación
  if (IS_PRODUCTION) {
    fastify.log.info('🔒 Auth: Production mode - JWT required');
  } else if (USE_MOCK_AUTH) {
    fastify.log.warn('⚠️  Auth: MOCK_AUTH enabled - requests without token use mock admin user');
    fastify.log.warn('    Set MOCK_AUTH=false to require real JWT tokens');
  } else {
    fastify.log.info('🔒 Auth: Development mode with JWT required (MOCK_AUTH=false)');
  }
}

export default fp(authPlugin, {
  name: 'auth',
});
