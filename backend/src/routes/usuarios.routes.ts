// Usuarios routes plugin

import { FastifyInstance, FastifyRequest } from 'fastify';
import { authenticate, requireAdmin } from '../plugins/auth';
import { UsuariosService } from '../services/usuarios.service';

type GetRequest = FastifyRequest<{ Params: { id: string } }>;

const paramsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export default async function usuariosRoutes(fastify: FastifyInstance): Promise<void> {
  // All routes require admin
  fastify.addHook('onRequest', authenticate);
  fastify.addHook('preHandler', requireAdmin);

  // GET /api/usuarios
  fastify.get('/', async () => {
    return UsuariosService.list();
  });

  // GET /api/usuarios/:id
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: paramsSchema } },
    async (request: GetRequest) => {
      return UsuariosService.get(request.params.id);
    }
  );
}
