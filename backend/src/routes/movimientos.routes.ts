// Movimientos routes plugin
// Thin layer: schema validation + controller delegation

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../plugins/auth';
import { MovimientosService, MovimientoError } from '../services/movimientos.service';
import {
  movimientoCreateSchema,
  movimientoUpdateSchema,
  movimientoParamsSchema,
  movimientoQuerySchema,
} from '../schemas/movimientos.schema';
import { MovimientoCreateDTO, MovimientoUpdateDTO, MovimientoFiltrosDTO } from '../dto/movimientos.dto';

// Request types
type ListRequest = FastifyRequest<{ Querystring: MovimientoFiltrosDTO }>;
type GetRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateRequest = FastifyRequest<{ Body: MovimientoCreateDTO }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: MovimientoUpdateDTO }>;

export default async function movimientosRoutes(fastify: FastifyInstance): Promise<void> {
  // All routes require authentication
  fastify.addHook('onRequest', authenticate);

  // GET /api/movimientos - List with filters
  fastify.get<{ Querystring: MovimientoFiltrosDTO }>(
    '/',
    {
      schema: {
        querystring: movimientoQuerySchema,
      },
    },
    async (request: ListRequest, reply: FastifyReply) => {
      const filtros: MovimientoFiltrosDTO = {
        fecha_desde: request.query.fecha_desde,
        fecha_hasta: request.query.fecha_hasta,
        categoria_id: request.query.categoria_id,
        medio_pago_id: request.query.medio_pago_id,
      };
      const movimientos = await MovimientosService.list(filtros);
      return movimientos;
    }
  );

  // GET /api/movimientos/:id - Get one
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: movimientoParamsSchema,
      },
    },
    async (request: GetRequest, reply: FastifyReply) => {
      const movimiento = await MovimientosService.get(request.params.id);
      return movimiento;
    }
  );

  // GET /api/movimientos/:id/puede-editar - Check edit permissions
  fastify.get<{ Params: { id: string } }>(
    '/:id/puede-editar',
    {
      schema: {
        params: movimientoParamsSchema,
      },
    },
    async (request: GetRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({ error: 'No autenticado' });
      }
      const resultado = await MovimientosService.puedeEditar(request.params.id, request.user);
      return resultado;
    }
  );

  // GET /api/movimientos/:id/historial - Audit history
  fastify.get<{ Params: { id: string } }>(
    '/:id/historial',
    {
      schema: {
        params: movimientoParamsSchema,
      },
    },
    async (request: GetRequest, reply: FastifyReply) => {
      const historial = await MovimientosService.getHistorial(request.params.id);
      return historial;
    }
  );

  // POST /api/movimientos - Create
  fastify.post<{ Body: MovimientoCreateDTO }>(
    '/',
    {
      schema: {
        body: movimientoCreateSchema,
      },
    },
    async (request: CreateRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({ error: 'No autenticado' });
      }

      const resultado = await MovimientosService.create(request.body, request.user.id);

      // If requires confirmation (duplicate detected, NOT created)
      if (resultado.requires_confirmation) {
        return reply.status(200).send(resultado);
      }

      // Movement created successfully
      return reply.status(201).send(resultado);
    }
  );

  // PUT /api/movimientos/:id - Update
  fastify.put<{ Params: { id: string }; Body: MovimientoUpdateDTO }>(
    '/:id',
    {
      schema: {
        params: movimientoParamsSchema,
        body: movimientoUpdateSchema,
      },
    },
    async (request: UpdateRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({ error: 'No autenticado' });
      }

      const movimiento = await MovimientosService.update(
        request.params.id,
        request.body,
        request.user
      );
      return movimiento;
    }
  );
}
