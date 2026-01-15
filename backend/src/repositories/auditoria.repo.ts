// Acceso a datos de auditoría usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { 
  AuditoriaMovimientoDTO, 
  AuditoriaCreateDTO,
  AuditoriaFiltrosDTO 
} from '../dto/auditoria.dto';

export const AuditoriaRepo = {
  /**
   * Lista todos los registros de auditoría.
   */
  list: async (filtros?: AuditoriaFiltrosDTO): Promise<AuditoriaMovimientoDTO[]> => {
    let auditoria = Store.auditoria.list();
    
    if (filtros) {
      if (filtros.movimiento_id) {
        auditoria = auditoria.filter(a => a.movimiento_id === filtros.movimiento_id);
      }
      if (filtros.usuario_id) {
        auditoria = auditoria.filter(a => a.usuario_id === filtros.usuario_id);
      }
      if (filtros.fecha_desde) {
        auditoria = auditoria.filter(a => a.cambiado_en >= filtros.fecha_desde!);
      }
      if (filtros.fecha_hasta) {
        auditoria = auditoria.filter(a => a.cambiado_en <= filtros.fecha_hasta!);
      }
    }
    
    return auditoria;
  },

  /**
   * Obtiene el historial de cambios de un movimiento.
   */
  getByMovimiento: async (movimientoId: string): Promise<AuditoriaMovimientoDTO[]> => {
    return Store.auditoria.getByMovimiento(movimientoId);
  },

  /**
   * Registra un cambio en un movimiento.
   */
  logChange: async (data: AuditoriaCreateDTO): Promise<AuditoriaMovimientoDTO> => {
    return Store.auditoria.log(data);
  },

  /**
   * Registra múltiples cambios en batch.
   */
  logChanges: async (entries: AuditoriaCreateDTO[]): Promise<void> => {
    Store.auditoria.logMultiple(entries);
  },
};
