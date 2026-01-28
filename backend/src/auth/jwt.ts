// JWT utilities según AUTH_AND_USERS.md
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN_SECONDS } from '../config/auth';

/** Payload del token JWT según AUTH_AND_USERS.md */
export type TokenPayload = {
  userId: string;
  rol: 'admin' | 'coach';
};

/**
 * Genera un JWT con el payload dado.
 * Duración: 8 horas (configurada en config/auth.ts)
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });
}

/**
 * Verifica y decodifica un JWT.
 * @returns El payload si es válido, null si es inválido o expirado
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
