// JSON Schemas for Opciones endpoints

export const opcionCreateSchema = {
  type: 'object',
  required: ['categoria_id', 'medio_pago_id', 'nombre_display'],
  properties: {
    categoria_id: { type: 'string', minLength: 1 },
    medio_pago_id: { type: 'string', minLength: 1 },
    nombre_display: { type: 'string', minLength: 1 },
    monto_sugerido: { type: ['number', 'null'] },
    icono: { type: 'string' },
    orden: { type: 'number' },
  },
  additionalProperties: false,
} as const;

export const opcionUpdateSchema = {
  type: 'object',
  properties: {
    nombre_display: { type: 'string', minLength: 1 },
    monto_sugerido: { type: ['number', 'null'] },
    icono: { type: 'string' },
    activo: { type: 'boolean' },
    orden: { type: 'number' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const opcionParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const opcionQuerySchema = {
  type: 'object',
  properties: {
    activas: { type: 'string', enum: ['true', 'false'] },
  },
} as const;

export const aumentoPreciosSchema = {
  type: 'object',
  required: ['porcentaje'],
  properties: {
    porcentaje: { type: 'number', exclusiveMinimum: 0, maximum: 100 },
    opcion_ids: { type: 'array', items: { type: 'string' } },
    redondear_a: { type: 'number', minimum: 1 },
  },
  additionalProperties: false,
} as const;
