// Acceso a persistencia de opciones de movimiento (stub).
// TODO: Implementar con base de datos real.

import { 
  OpcionMovimientoDTO, 
  OpcionMovimientoEnriquecidaDTO,
  OpcionCreateDTO, 
  OpcionUpdateDTO 
} from '../dto/opciones.dto';

export const OpcionesRepo = {
  /**
   * Lista todas las opciones.
   * @param soloActivas - Si true, filtra solo las activas
   */
  list: async (soloActivas = false): Promise<OpcionMovimientoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Lista opciones con datos enriquecidos (join con categoría y medio).
   */
  listEnriquecidas: async (soloActivas = false): Promise<OpcionMovimientoEnriquecidaDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Busca una opción por ID.
   */
  findById: async (id: string): Promise<OpcionMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca una opción por ID con datos enriquecidos.
   */
  findByIdEnriquecida: async (id: string): Promise<OpcionMovimientoEnriquecidaDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Verifica si existe una opción con la misma combinación categoría+medio.
   */
  findByCategoriaMedio: async (
    categoriaId: string, 
    medioId: string
  ): Promise<OpcionMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Crea una nueva opción.
   */
  create: async (payload: OpcionCreateDTO): Promise<OpcionMovimientoDTO> => {
    // TODO: Implementar persistencia
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      categoria_id: payload.categoria_id,
      medio_pago_id: payload.medio_pago_id,
      nombre_display: payload.nombre_display,
      monto_sugerido: payload.monto_sugerido ?? null,
      icono: payload.icono ?? 'default.png',
      activo: true,
      orden: payload.orden ?? 0,
      fecha_actualizacion_precio: payload.monto_sugerido ? now : null,
      created_at: now,
      updated_at: now,
    };
  },

  /**
   * Actualiza una opción existente.
   */
  update: async (id: string, payload: OpcionUpdateDTO): Promise<OpcionMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Actualiza el precio de múltiples opciones.
   * Retorna la cantidad de opciones actualizadas.
   */
  updatePrecios: async (
    updates: Array<{ id: string; monto_sugerido: number }>
  ): Promise<number> => {
    // TODO: Implementar persistencia
    return 0;
  },

  /**
   * Verifica si existen movimientos que usen esta opción.
   * Usado para validar antes de desactivar.
   */
  tieneMovimientos: async (opcionId: string): Promise<boolean> => {
    // TODO: Implementar persistencia
    return false;
  },

  /**
   * Cuenta opciones activas que usan una categoría.
   */
  countByCategoria: async (categoriaId: string, soloActivas = true): Promise<number> => {
    // TODO: Implementar persistencia
    return 0;
  },

  /**
   * Cuenta opciones activas que usan un medio de pago.
   */
  countByMedio: async (medioId: string, soloActivas = true): Promise<number> => {
    // TODO: Implementar persistencia
    return 0;
  },
};
