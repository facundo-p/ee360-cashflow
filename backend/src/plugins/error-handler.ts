// Global error handler for Fastify
// Maps domain errors to HTTP responses

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { MovimientoError } from '../services/movimientos.service';
import { CategoriaError } from '../services/categorias.service';
import { MedioPagoError } from '../services/medios.service';
import { OpcionError } from '../services/opciones.service';
import { AuthError } from '../services/auth.service';
import { UsuarioError } from '../services/usuarios.service';

// Domain error code to HTTP status mapping
const errorStatusMap: Record<string, number> = {
  // Auth errors
  INVALID_CREDENTIALS: 401,
  USER_INACTIVE: 403,
  INVALID_TOKEN: 401,
  
  // Common errors
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  PERMISSION_DENIED: 403,
  
  // Movimiento errors
  OPCION_NOT_FOUND: 400,
  OPCION_INACTIVE: 400,
  EDIT_WINDOW_EXPIRED: 403,
  
  // Categoria/Medio/Opcion errors
  DUPLICATE_NAME: 409,
  DUPLICATE_COMBINATION: 409,
  HAS_ACTIVE_OPTIONS: 409,
  HAS_MOVEMENTS: 409,
  CATEGORIA_NOT_FOUND: 400,
  CATEGORIA_INACTIVE: 400,
  MEDIO_NOT_FOUND: 400,
  MEDIO_INACTIVE: 400,
  
  // Usuario errors
  DUPLICATE_EMAIL: 409,
};

// Check if error is a domain error
function isDomainError(error: unknown): error is { code: string; message: string } {
  return (
    error instanceof MovimientoError ||
    error instanceof CategoriaError ||
    error instanceof MedioPagoError ||
    error instanceof OpcionError ||
    error instanceof AuthError ||
    error instanceof UsuarioError
  );
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log the error
  request.log.error(error);

  // Handle Fastify validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: 'Error de validación',
      code: 'VALIDATION_ERROR',
      details: error.validation,
    });
  }

  // Handle domain errors
  if (isDomainError(error)) {
    const status = errorStatusMap[error.code] || 400;
    return reply.status(status).send({
      error: error.message,
      code: error.code,
    });
  }

  // Handle unknown errors
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    error: statusCode === 500 ? 'Error interno del servidor' : error.message,
    code: 'INTERNAL_ERROR',
  });
}
