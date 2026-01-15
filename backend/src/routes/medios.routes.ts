// Medios de Pago routes plugin

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate, requireAdmin } from '../plugins/auth';
import { MediosService } from '../services/medios.service';
import {
  medioCreateSchema,
  medioUpdateSchema,
  medioParamsSchema,
  medioQuerySchema,
} from '../schemas/medios.schema';
import { MedioPagoCreateDTO, MedioPagoUpdateDTO } from '../dto/medios.dto';

type ListRequest = FastifyRequest<{ Querystring: { activos?: string } }>;
type GetRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateRequest = FastifyRequest<{ Body: MedioPagoCreateDTO }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: MedioPagoUpdateDTO }>;

export default async function mediosRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', authenticate);

  // GET /api/medios
  fastify.get<{ Querystring: { activos?: string } }>(
    '/',
    { schema: { querystring: medioQuerySchema } },
    async (request: ListRequest) => {
      const soloActivos = request.query.activos === 'true';
      return MediosService.list({ soloActivos });
    }
  );

  // GET /api/medios/:id
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: medioParamsSchema } },
    async (request: GetRequest) => {
      return MediosService.get(request.params.id);
    }
  );

  // POST /api/medios (admin only)
  fastify.post<{ Body: MedioPagoCreateDTO }>(
    '/',
    {
      schema: { body: medioCreateSchema },
      preHandler: requireAdmin,
    },
    async (request: CreateRequest, reply: FastifyReply) => {
      const medio = await MediosService.create(request.body);
      return reply.status(201).send(medio);
    }
  );

  // PUT /api/medios/:id (admin only)
  fastify.put<{ Params: { id: string }; Body: MedioPagoUpdateDTO }>(
    '/:id',
    {
      schema: { params: medioParamsSchema, body: medioUpdateSchema },
      preHandler: requireAdmin,
    },
    async (request: UpdateRequest) => {
      return MediosService.update(request.params.id, request.body);
    }
  );

  // PATCH /api/medios/:id/toggle (admin only)
  fastify.patch<{ Params: { id: string } }>(
    '/:id/toggle',
    {
      schema: { params: medioParamsSchema },
      preHandler: requireAdmin,
    },
    async (request: GetRequest) => {
      return MediosService.toggle(request.params.id);
    }
  );

  // GET /api/medios/:id/has-opciones
  fastify.get<{ Params: { id: string } }>(
    '/:id/has-opciones',
    { schema: { params: medioParamsSchema } },
    async (request: GetRequest) => {
      const hasOpciones = await MediosService.hasActiveOpciones(request.params.id);
      return { has_opciones: hasOpciones };
    }
  );
}
