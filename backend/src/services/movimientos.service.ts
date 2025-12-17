// Reglas de negocio de movimientos: permisos, 24h usuario, admin sin límite.
import { MovimientosRepo } from '../repositories/movimientos.repo';
import { AuditoriaRepo } from '../repositories/auditoria.repo';
import { MovimientoDTO } from '../dto/movimientos.dto';

export const MovimientosService = {
  list: async () => MovimientosRepo.list(),
  get: async (id: string) => MovimientosRepo.findById(id),
  create: async (payload: Partial<MovimientoDTO>) => MovimientosRepo.create(payload),
  update: async (id: string, payload: Partial<MovimientoDTO>, actorId: string) => {
    const before = await MovimientosRepo.findById(id);
    const updated = await MovimientosRepo.update(id, payload);
    if (before) {
      Object.keys(payload).forEach((campo) => {
        const key = campo as keyof MovimientoDTO;
        AuditoriaRepo.logChange({
          movimiento_id: id,
          usuario_id: actorId,
          campo,
          valor_anterior: String(before[key] ?? ''),
          valor_nuevo: String((payload as Record<string, unknown>)[campo] ?? ''),
        });
      });
    }
    return updated;
  },
};


