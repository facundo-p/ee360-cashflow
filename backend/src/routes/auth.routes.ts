// Auth routes plugin

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../plugins/auth';
import { AuthService } from '../services/auth.service';
import { loginSchema } from '../schemas/auth.schema';
import { LoginRequest } from '../dto/auth.dto';

type LoginRequestType = FastifyRequest<{ Body: LoginRequest }>;

export default async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/auth/login - Public
  fastify.post<{ Body: LoginRequest }>(
    '/login',
    { schema: { body: loginSchema } },
    async (request: LoginRequestType) => {
      const result = await AuthService.login(request.body);
      return result;
    }
  );

  // GET /api/auth/me - Requires auth
  fastify.get(
    '/me',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({ error: 'No autenticado' });
      }
      return request.user;
    }
  );
}
