// Acceso a persistencia de movimientos (stub).
// TODO: Implementar con base de datos real.

import { 
  MovimientoDTO, 
  MovimientoEnriquecidoDTO,
  MovimientoCreateDTO, 
  MovimientoUpdateDTO,
  MovimientoFiltrosDTO 
} from '../dto/movimientos.dto';

export const MovimientosRepo = {
  /**
   * Lista movimientos con filtros opcionales.
   */
  list: async (filtros?: MovimientoFiltrosDTO): Promise<MovimientoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Lista movimientos con datos enriquecidos.
   */
  listEnriquecidos: async (filtros?: MovimientoFiltrosDTO): Promise<MovimientoEnriquecidoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Busca un movimiento por ID.
   */
  findById: async (id: string): Promise<MovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca un movimiento por ID con datos enriquecidos.
   */
  findByIdEnriquecido: async (id: string): Promise<MovimientoEnriquecidoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca posibles duplicados según criterios de business-rules.md 2.4.
   */
  findDuplicado: async (params: {
    opcion_id: string;
    monto: number;
    nombre_cliente: string | null;
    fecha: string;
  }): Promise<MovimientoDTO | null> => {
    // TODO: Implementar persistencia
    // Buscar movimiento con: mismo opcion_id, monto, nombre_cliente, fecha
    return null;
  },

  /**
   * Crea un nuevo movimiento.
   */
  create: async (
    payload: MovimientoCreateDTO, 
    userId: string
  ): Promise<MovimientoDTO> => {
    // TODO: Implementar persistencia
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      fecha: payload.fecha,
      opcion_id: payload.opcion_id,
      monto: payload.monto,
      nombre_cliente: payload.nombre_cliente ?? null,
      nota: payload.nota ?? null,
      created_by_user_id: userId,
      created_at: now,
      updated_by_user_id: null,
      updated_at: null,
    };
  },

  /**
   * Actualiza un movimiento existente.
   */
  update: async (
    id: string, 
    payload: MovimientoUpdateDTO,
    userId: string
  ): Promise<MovimientoDTO | null> => {
    // TODO: Implementar persistencia
    // Debe actualizar updated_by_user_id y updated_at
    return null;
  },

  /**
   * Cuenta movimientos que usan una opción específica.
   */
  countByOpcion: async (opcionId: string): Promise<number> => {
    // TODO: Implementar persistencia
    return 0;
  },
};