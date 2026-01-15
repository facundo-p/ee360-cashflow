// JSON Schemas for Medios de Pago endpoints

export const medioCreateSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: { type: 'string', minLength: 1 },
    orden: { type: 'number' },
  },
  additionalProperties: false,
} as const;

export const medioUpdateSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1 },
    activo: { type: 'boolean' },
    orden: { type: 'number' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const medioParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const medioQuerySchema = {
  type: 'object',
  properties: {
    activos: { type: 'string', enum: ['true', 'false'] },
  },
} as const;
