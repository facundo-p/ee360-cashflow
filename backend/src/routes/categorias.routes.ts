// Categorias routes plugin

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate, requireAdmin } from '../plugins/auth';
import { CategoriasService } from '../services/categorias.service';
import {
  categoriaCreateSchema,
  categoriaUpdateSchema,
  categoriaParamsSchema,
  categoriaQuerySchema,
} from '../schemas/categorias.schema';
import { CategoriaCreateDTO, CategoriaUpdateDTO } from '../dto/categorias.dto';

type ListRequest = FastifyRequest<{ Querystring: { activas?: string } }>;
type GetRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateRequest = FastifyRequest<{ Body: CategoriaCreateDTO }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: CategoriaUpdateDTO }>;

export default async function categoriasRoutes(fastify: FastifyInstance): Promise<void> {
  // All routes require authentication
  fastify.addHook('onRequest', authenticate);

  // GET /api/categorias
  fastify.get<{ Querystring: { activas?: string } }>(
    '/',
    { schema: { querystring: categoriaQuerySchema } },
    async (request: ListRequest) => {
      const soloActivas = request.query.activas === 'true';
      return CategoriasService.list({ soloActivas });
    }
  );

  // GET /api/categorias/:id
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: categoriaParamsSchema } },
    async (request: GetRequest) => {
      return CategoriasService.get(request.params.id);
    }
  );

  // POST /api/categorias (admin only)
  fastify.post<{ Body: CategoriaCreateDTO }>(
    '/',
    {
      schema: { body: categoriaCreateSchema },
      preHandler: requireAdmin,
    },
    async (request: CreateRequest, reply: FastifyReply) => {
      const categoria = await CategoriasService.create(request.body);
      return reply.status(201).send(categoria);
    }
  );

  // PUT /api/categorias/:id (admin only)
  fastify.put<{ Params: { id: string }; Body: CategoriaUpdateDTO }>(
    '/:id',
    {
      schema: { params: categoriaParamsSchema, body: categoriaUpdateSchema },
      preHandler: requireAdmin,
    },
    async (request: UpdateRequest) => {
      console.log("Request: ", request.body);
      console.log("Params: ", request.params);
      return CategoriasService.update(request.params.id, request.body);
    }
  );

  // PATCH /api/categorias/:id/toggle (admin only)
  fastify.patch<{ Params: { id: string } }>(
    '/:id/toggle',
    {
      schema: { params: categoriaParamsSchema },
      preHandler: requireAdmin,
    },
    async (request: GetRequest) => {
      return CategoriasService.toggle(request.params.id);
    }
  );

  // GET /api/categorias/:id/has-opciones
  fastify.get<{ Params: { id: string } }>(
    '/:id/has-opciones',
    { schema: { params: categoriaParamsSchema } },
    async (request: GetRequest) => {
      const hasOpciones = await CategoriasService.hasActiveOpciones(request.params.id);
      return { has_opciones: hasOpciones };
    }
  );
}
