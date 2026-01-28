// Auth routes según AUTH_AND_USERS.md
// POST /api/auth/login - Público
// GET /api/auth/me - Requiere autenticación

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../plugins/auth';
import { AuthService, AuthError } from '../services/auth.service';
import { loginSchema } from '../schemas/auth.schema';
import { LoginRequest } from '../dto/auth.dto';

type LoginRequestType = FastifyRequest<{ Body: LoginRequest }>;

export default async function authRoutes(
  fastify: FastifyInstance
): Promise<void> {
  // POST /api/auth/login - Public
  fastify.post<{ Body: LoginRequest }>(
    '/login',
    { schema: { body: loginSchema } },
    async (request: LoginRequestType, reply: FastifyReply) => {
      try {
        const result = await AuthService.login(request.body);
        return result;
      } catch (error) {
        if (error instanceof AuthError) {
          const statusCode =
            error.code === 'USER_INACTIVE' ? 403 : 401;
          return reply.status(statusCode).send({
            error: error.message,
            code: error.code,
          });
        }
        throw error;
      }
    }
  );

  // GET /api/auth/me - Requires auth
  fastify.get(
    '/me',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({
          error: 'No autenticado',
          code: 'NOT_AUTHENTICATED',
        });
      }
      return request.user;
    }
  );
}
