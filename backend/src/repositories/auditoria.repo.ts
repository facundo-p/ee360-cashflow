// Acceso a persistencia de auditoría (stub).
// TODO: Implementar con base de datos real.

import { AuditoriaMovimientoDTO, AuditoriaCreateDTO, AuditoriaFiltrosDTO } from '../dto/auditoria.dto';

export const AuditoriaRepo = {
  /**
   * Lista registros de auditoría con filtros.
   */
  list: async (filtros?: AuditoriaFiltrosDTO): Promise<AuditoriaMovimientoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Obtiene el historial de cambios de un movimiento.
   */
  getByMovimiento: async (movimientoId: string): Promise<AuditoriaMovimientoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Registra un cambio en auditoría.
   * Llamado por MovimientosService.update()
   */
  logChange: async (payload: AuditoriaCreateDTO): Promise<AuditoriaMovimientoDTO> => {
    // TODO: Implementar persistencia
    return {
      id: crypto.randomUUID(),
      movimiento_id: payload.movimiento_id,
      usuario_id: payload.usuario_id,
      campo: payload.campo,
      valor_anterior: payload.valor_anterior,
      valor_nuevo: payload.valor_nuevo,
      fecha: new Date().toISOString(),
    };
  },

  /**
   * Registra múltiples cambios en una transacción.
   */
  logChanges: async (payloads: AuditoriaCreateDTO[]): Promise<void> => {
    // TODO: Implementar persistencia (batch insert)
    for (const payload of payloads) {
      await AuditoriaRepo.logChange(payload);
    }
  },
};