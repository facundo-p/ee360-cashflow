// JSON Schemas for Categorias endpoints

export const categoriaCreateSchema = {
  type: 'object',
  required: ['nombre', 'sentido'],
  properties: {
    nombre: { type: 'string', minLength: 1 },
    sentido: { type: 'string', enum: ['ingreso', 'egreso'] },
    orden: { type: 'number' },
  },
  additionalProperties: false,
} as const;

export const categoriaUpdateSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1 },
    activo: { type: 'boolean' },
    orden: { type: 'number' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const categoriaParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const categoriaQuerySchema = {
  type: 'object',
  properties: {
    activas: { type: 'string', enum: ['true', 'false'] },
  },
} as const;
