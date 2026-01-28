// Usuarios routes plugin según AUTH_AND_USERS.md
// Todas las rutas requieren rol admin (sección 3.2)

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate, requireAdmin } from '../plugins/auth';
import { UsuariosService, UsuarioError } from '../services/usuarios.service';
import {
  usuarioParamsSchema,
  usuarioCreateSchema,
  usuarioUpdateSchema,
  usuarioChangePasswordSchema,
  usuarioQuerySchema,
} from '../schemas/usuarios.schema';
import { UsuarioCreateDTO, UsuarioUpdateDTO } from '../dto/usuarios.dto';

// Request types
type ListRequest = FastifyRequest<{ Querystring: { activos?: string } }>;
type GetRequest = FastifyRequest<{ Params: { id: string } }>;
type CreateRequest = FastifyRequest<{ Body: UsuarioCreateDTO }>;
type UpdateRequest = FastifyRequest<{ Params: { id: string }; Body: UsuarioUpdateDTO }>;
type ChangePasswordRequest = FastifyRequest<{ Params: { id: string }; Body: { password: string } }>;

export default async function usuariosRoutes(fastify: FastifyInstance): Promise<void> {
  // Todas las rutas requieren autenticación + rol admin
  fastify.addHook('onRequest', authenticate);
  fastify.addHook('preHandler', requireAdmin);

  // GET /api/usuarios - Listar usuarios
  fastify.get<{ Querystring: { activos?: string } }>(
    '/',
    { schema: { querystring: usuarioQuerySchema } },
    async (request: ListRequest) => {
      const soloActivos = request.query.activos === 'true';
      return UsuariosService.list(soloActivos);
    }
  );

  // GET /api/usuarios/:id - Obtener usuario por ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: { params: usuarioParamsSchema } },
    async (request: GetRequest, reply: FastifyReply) => {
      try {
        return await UsuariosService.get(request.params.id);
      } catch (error) {
        if (error instanceof UsuarioError && error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );

  // POST /api/usuarios - Crear usuario
  fastify.post<{ Body: UsuarioCreateDTO }>(
    '/',
    { schema: { body: usuarioCreateSchema } },
    async (request: CreateRequest, reply: FastifyReply) => {
      try {
        const usuario = await UsuariosService.create(request.body);
        return reply.status(201).send(usuario);
      } catch (error) {
        if (error instanceof UsuarioError) {
          const statusCode = error.code === 'DUPLICATE_USERNAME' ? 409 : 400;
          return reply.status(statusCode).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );

  // PUT /api/usuarios/:id - Actualizar usuario (sin password)
  fastify.put<{ Params: { id: string }; Body: UsuarioUpdateDTO }>(
    '/:id',
    { schema: { params: usuarioParamsSchema, body: usuarioUpdateSchema } },
    async (request: UpdateRequest, reply: FastifyReply) => {
      try {
        return await UsuariosService.update(request.params.id, request.body);
      } catch (error) {
        if (error instanceof UsuarioError) {
          const statusCode = 
            error.code === 'NOT_FOUND' ? 404 :
            error.code === 'DUPLICATE_USERNAME' ? 409 : 400;
          return reply.status(statusCode).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );

  // PATCH /api/usuarios/:id/password - Cambiar password
  fastify.patch<{ Params: { id: string }; Body: { password: string } }>(
    '/:id/password',
    { schema: { params: usuarioParamsSchema, body: usuarioChangePasswordSchema } },
    async (request: ChangePasswordRequest, reply: FastifyReply) => {
      try {
        await UsuariosService.changePassword(request.params.id, request.body.password);
        return { success: true, message: 'Password actualizado' };
      } catch (error) {
        if (error instanceof UsuarioError) {
          const statusCode = error.code === 'NOT_FOUND' ? 404 : 400;
          return reply.status(statusCode).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );

  // PATCH /api/usuarios/:id/activar - Activar usuario
  fastify.patch<{ Params: { id: string } }>(
    '/:id/activar',
    { schema: { params: usuarioParamsSchema } },
    async (request: GetRequest, reply: FastifyReply) => {
      try {
        return await UsuariosService.activar(request.params.id);
      } catch (error) {
        if (error instanceof UsuarioError && error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );

  // PATCH /api/usuarios/:id/desactivar - Desactivar usuario
  fastify.patch<{ Params: { id: string } }>(
    '/:id/desactivar',
    { schema: { params: usuarioParamsSchema } },
    async (request: GetRequest, reply: FastifyReply) => {
      try {
        return await UsuariosService.desactivar(request.params.id);
      } catch (error) {
        if (error instanceof UsuarioError && error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    }
  );
}
