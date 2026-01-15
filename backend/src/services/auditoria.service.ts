// Lógica de negocio de auditoría.
// Regla 2.1 de business-rules.md

import { AuditoriaRepo } from '../repositories/auditoria.repo';
import { AuditoriaMovimientoDTO, AuditoriaFiltrosDTO } from '../dto/auditoria.dto';

export const AuditoriaService = {
  /**
   * Lista registros de auditoría con filtros.
   */
  list: async (filtros?: AuditoriaFiltrosDTO): Promise<AuditoriaMovimientoDTO[]> => {
    return AuditoriaRepo.list(filtros);
  },

  /**
   * Obtiene el historial de cambios de un movimiento.
   */
  getByMovimiento: async (movimientoId: string): Promise<AuditoriaMovimientoDTO[]> => {
    return AuditoriaRepo.getByMovimiento(movimientoId);
  },
};
