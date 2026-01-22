// JSON Schemas for Movimientos endpoints
// Used by Fastify for request validation

export const movimientoCreateSchema = {
  type: 'object',
  required: ['fecha', 'categoria_movimiento_id', 'medio_pago_id', 'monto'],
  properties: {
    fecha: { 
      type: 'string', 
      format: 'date',
      description: 'Fecha del movimiento (YYYY-MM-DD)'
    },
    categoria_movimiento_id: { 
      type: 'string',
      minLength: 1,
      description: 'ID de la categoría de movimiento'
    },
    medio_pago_id: { 
      type: 'string',
      minLength: 1,
      description: 'ID del medio de pago'
    },
    monto: { 
      type: 'number',
      exclusiveMinimum: 0,
      description: 'Monto del movimiento (debe ser > 0)'
    },
    nombre_cliente: { 
      type: ['string', 'null'],
      description: 'Nombre del cliente (opcional)'
    },
    nota: { 
      type: ['string', 'null'],
      description: 'Nota adicional (opcional)'
    },
    confirmar_duplicado: { 
      type: 'boolean',
      default: false,
      description: 'Si true, crea el movimiento aunque se detecte duplicado'
    },
  },
  additionalProperties: false,
} as const;

export const movimientoUpdateSchema = {
  type: 'object',
  properties: {
    fecha: { 
      type: 'string', 
      format: 'date',
      description: 'Fecha del movimiento (YYYY-MM-DD)'
    },
    monto: { 
      type: 'number',
      exclusiveMinimum: 0,
      description: 'Monto del movimiento (debe ser > 0)'
    },
    nombre_cliente: { 
      type: ['string', 'null'],
      description: 'Nombre del cliente (opcional)'
    },
    nota: { 
      type: ['string', 'null'],
      description: 'Nota adicional (opcional)'
    },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const movimientoParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const movimientoQuerySchema = {
  type: 'object',
  properties: {
    fecha_desde: { type: 'string', format: 'date' },
    fecha_hasta: { type: 'string', format: 'date' },
    categoria_id: { type: 'string' },
    medio_pago_id: { type: 'string' },
  },
} as const;
