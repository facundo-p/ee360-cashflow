// JSON Schemas for Usuarios endpoints según AUTH_AND_USERS.md

export const usuarioParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const usuarioCreateSchema = {
  type: 'object',
  required: ['nombre', 'username', 'password', 'rol'],
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 100 },
    username: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    rol: { type: 'string', enum: ['admin', 'coach'] },
  },
  additionalProperties: false,
} as const;

export const usuarioUpdateSchema = {
  type: 'object',
  properties: {
    nombre: { type: 'string', minLength: 1, maxLength: 100 },
    username: { type: 'string', format: 'email' },
    rol: { type: 'string', enum: ['admin', 'coach'] },
  },
  additionalProperties: false,
} as const;

export const usuarioChangePasswordSchema = {
  type: 'object',
  required: ['password'],
  properties: {
    password: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
} as const;

export const usuarioQuerySchema = {
  type: 'object',
  properties: {
    activos: { type: 'string', enum: ['true', 'false'] },
  },
} as const;
