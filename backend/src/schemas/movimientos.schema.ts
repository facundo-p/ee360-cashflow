// JSON Schemas for Movimientos endpoints
// Used by Fastify for request validation

export const movimientoCreateSchema = {
  type: 'object',
  required: ['fecha', 'opcion_id', 'monto'],
  properties: {
    fecha: { 
      type: 'string', 
      format: 'date',
      description: 'Fecha del movimiento (YYYY-MM-DD)'
    },
    opcion_id: { 
      type: 'string',
      minLength: 1,
      description: 'ID de la opción de movimiento'
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
    opcion_id: { 
      type: 'string',
      minLength: 1,
      description: 'ID de la opción de movimiento'
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
    opcion_id: { type: 'string' },
    categoria_id: { type: 'string' },
    medio_pago_id: { type: 'string' },
  },
} as const;
