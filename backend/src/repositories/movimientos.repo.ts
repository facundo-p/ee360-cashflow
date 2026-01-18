// Acceso a datos de movimientos usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { 
  MovimientoDTO, 
  MovimientoEnriquecidoDTO,
  MovimientoCreateDTO, 
  MovimientoUpdateDTO,
  MovimientoFiltrosDTO 
} from '../dto/movimientos.dto';
import { IdFactory } from '../utils/idFactory';

export const MovimientosRepo = {
  /**
   * Lista movimientos con filtros opcionales.
   */
  list: async (filtros?: MovimientoFiltrosDTO): Promise<MovimientoDTO[]> => {
    let movimientos = Store.movimientos.list();
    
    if (filtros) {
      if (filtros.fecha_desde) {
        movimientos = movimientos.filter(m => m.fecha >= filtros.fecha_desde!);
      }
      if (filtros.fecha_hasta) {
        movimientos = movimientos.filter(m => m.fecha <= filtros.fecha_hasta!);
      }
      if (filtros.opcion_id) {
        movimientos = movimientos.filter(m => m.opcion_id === filtros.opcion_id);
      }
      if (filtros.created_by_user_id) {
        movimientos = movimientos.filter(m => m.created_by_user_id === filtros.created_by_user_id);
      }
      // For categoria_id and medio_pago_id, we need to look up the opcion
      if (filtros.categoria_id || filtros.medio_pago_id) {
        movimientos = movimientos.filter(m => {
          const opcion = Store.opciones.findById(m.opcion_id);
          if (!opcion) return false;
          if (filtros.categoria_id && opcion.categoria_id !== filtros.categoria_id) return false;
          if (filtros.medio_pago_id && opcion.medio_pago_id !== filtros.medio_pago_id) return false;
          return true;
        });
      }
    }
    
    return movimientos;
  },

  /**
   * Lista movimientos con datos enriquecidos.
   */
  listEnriquecidos: async (filtros?: MovimientoFiltrosDTO): Promise<MovimientoEnriquecidoDTO[]> => {
    let movimientos = Store.movimientos.listEnriquecidos();
    
    if (filtros) {
      if (filtros.fecha_desde) {
        movimientos = movimientos.filter(m => m.fecha >= filtros.fecha_desde!);
      }
      if (filtros.fecha_hasta) {
        movimientos = movimientos.filter(m => m.fecha <= filtros.fecha_hasta!);
      }
      if (filtros.opcion_id) {
        movimientos = movimientos.filter(m => m.opcion_id === filtros.opcion_id);
      }
      if (filtros.categoria_id) {
        movimientos = movimientos.filter(m => {
          const opcion = Store.opciones.findById(m.opcion_id);
          return opcion?.categoria_id === filtros.categoria_id;
        });
      }
      if (filtros.medio_pago_id) {
        movimientos = movimientos.filter(m => {
          const opcion = Store.opciones.findById(m.opcion_id);
          return opcion?.medio_pago_id === filtros.medio_pago_id;
        });
      }
      if (filtros.created_by_user_id) {
        movimientos = movimientos.filter(m => m.created_by_user_id === filtros.created_by_user_id);
      }
    }
    
    return movimientos;
  },

  /**
   * Busca un movimiento por ID.
   */
  findById: async (id: string): Promise<MovimientoDTO | null> => {
    return Store.movimientos.findById(id);
  },

  /**
   * Busca un movimiento por ID con datos enriquecidos.
   */
  findByIdEnriquecido: async (id: string): Promise<MovimientoEnriquecidoDTO | null> => {
    return Store.movimientos.findByIdEnriquecido(id);
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
    return Store.movimientos.findDuplicado(params);
  },

  /**
   * Crea un nuevo movimiento.
   */
  create: async (
    payload: MovimientoCreateDTO, 
    userId: string
  ): Promise<MovimientoDTO> => {
    return Store.movimientos.create({
      id: IdFactory.movimiento(),
      fecha: payload.fecha,
      opcion_id: payload.opcion_id,
      monto: payload.monto,
      nombre_cliente: payload.nombre_cliente ?? null,
      nota: payload.nota ?? null,
      created_by_user_id: userId,
    });
  },

  /**
   * Actualiza un movimiento existente.
   */
  update: async (
    id: string, 
    payload: MovimientoUpdateDTO,
    userId: string
  ): Promise<MovimientoDTO | null> => {
    return Store.movimientos.update(id, payload, userId);
  },

  /**
   * Cuenta movimientos que usan una opción específica.
   */
  countByOpcion: async (opcionId: string): Promise<number> => {
    return Store.movimientos.countByOpcion(opcionId);
  },
};
