// Opciones routes plugin

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate, requireAdmin } from '../plugins/auth';
import { OpcionesService } from '../services/opciones.service';
import {
  opcionCreateSchema,
  opcionUpdateSchema,
  opcionParamsSchema,
  opcionQuerySchema,
  aumentoPreciosSchema,
} from '../schemas/opciones.schema';
import { OpcionCreateDTO, OpcionUpdateDTO, AumentoPreciosDTO } from '../dto/opciones.dto';

type ListRequest = FastifyRequest<{ Querystring: { activas?: string } }>;
type GetRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateRequest = FastifyRequest<{ Body: OpcionCreateDTO }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: OpcionUpdateDTO }>;
type AumentoPreciosRequest = FastifyRequest<{ Body: AumentoPreciosDTO }>;

export default async function opcionesRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', authenticate);

  // GET /api/opciones
  fastify.get<{ Querystring: { activas?: string } }>(
    '/',
    { schema: { querystring: opcionQuerySchema } },
    async (request: ListRequest) => {
      const soloActivas = request.query.activas === 'true';
      return OpcionesService.list({ soloActivas });
    }
  );

  // GET /api/opciones/iconos
  fastify.get('/iconos', async () => {
    return OpcionesService.listIconosDisponibles();
  });

  // GET /api/opciones/:id
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: opcionParamsSchema } },
    async (request: GetRequest) => {
      return OpcionesService.get(request.params.id);
    }
  );

  // POST /api/opciones (admin only)
  fastify.post<{ Body: OpcionCreateDTO }>(
    '/',
    {
      schema: { body: opcionCreateSchema },
      preHandler: requireAdmin,
    },
    async (request: CreateRequest, reply: FastifyReply) => {
      const opcion = await OpcionesService.create(request.body);
      return reply.status(201).send(opcion);
    }
  );

  // POST /api/opciones/aumentar-precios (admin only)
  fastify.post<{ Body: AumentoPreciosDTO }>(
    '/aumentar-precios',
    {
      schema: { body: aumentoPreciosSchema },
      preHandler: requireAdmin,
    },
    async (request: AumentoPreciosRequest) => {
      return OpcionesService.aumentarPrecios(request.body);
    }
  );

  // PUT /api/opciones/:id (admin only)
  fastify.put<{ Params: { id: string }; Body: OpcionUpdateDTO }>(
    '/:id',
    {
      schema: { params: opcionParamsSchema, body: opcionUpdateSchema },
      preHandler: requireAdmin,
    },
    async (request: UpdateRequest) => {
      return OpcionesService.update(request.params.id, request.body);
    }
  );

  // PATCH /api/opciones/:id/toggle (admin only)
  fastify.patch<{ Params: { id: string } }>(
    '/:id/toggle',
    {
      schema: { params: opcionParamsSchema },
      preHandler: requireAdmin,
    },
    async (request: GetRequest) => {
      return OpcionesService.toggle(request.params.id);
    }
  );
}
