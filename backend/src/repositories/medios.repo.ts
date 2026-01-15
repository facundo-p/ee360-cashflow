// Acceso a persistencia de medios de pago (stub).
// TODO: Implementar con base de datos real.

import { MedioPagoDTO, MedioPagoCreateDTO, MedioPagoUpdateDTO } from '../dto/medios.dto';

export const MediosRepo = {
  /**
   * Lista todos los medios de pago.
   * @param soloActivos - Si true, filtra solo los activos
   */
  list: async (soloActivos = false): Promise<MedioPagoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Busca un medio de pago por ID.
   */
  findById: async (id: string): Promise<MedioPagoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca un medio de pago por nombre (para validar unicidad).
   */
  findByNombre: async (nombre: string): Promise<MedioPagoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Crea un nuevo medio de pago.
   */
  create: async (payload: MedioPagoCreateDTO): Promise<MedioPagoDTO> => {
    // TODO: Implementar persistencia
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      nombre: payload.nombre,
      activo: true,
      orden: payload.orden ?? 0,
      created_at: now,
      updated_at: now,
    };
  },

  /**
   * Actualiza un medio de pago existente.
   */
  update: async (id: string, payload: MedioPagoUpdateDTO): Promise<MedioPagoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Verifica si existen opciones activas que usen este medio.
   * Usado para validar antes de desactivar.
   */
  tieneOpcionesActivas: async (medioId: string): Promise<boolean> => {
    // TODO: Implementar persistencia
    return false;
  },
};