// backend/src/utils/idFactory.ts
import { randomUUID } from 'crypto';

/**
 * Genera IDs consistentes para el dominio.
 * 
 * Reglas:
 * - Entidades operativas → UUID v4
 * - Catálogos → IDs semánticos (NO acá)
 */

export const IdFactory = {
  movimiento(): string {
    return `mov_${randomUUID()}`;
  },

  usuario(): string {
    return `usr_${randomUUID()}`;
  },

  // Si en el futuro decidís que opciones sean UUID
  opcion(): string {
    return `op_${randomUUID()}`;
  },

  medio(nombre: string): string {
    return `m_${nombre.toLowerCase().replace(/ /g, '_')}`;
  },

  categoria(nombre: string): string {
    return `cat_${nombre.toLowerCase().replace(/ /g, '_')}`;
  },
};
