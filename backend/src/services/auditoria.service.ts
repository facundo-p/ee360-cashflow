// Servicio para registrar auditoría de movimientos.
import { AuditoriaRepo, AuditLog } from '../repositories/auditoria.repo';

export const AuditoriaService = {
  log: async (entry: AuditLog) => AuditoriaRepo.logChange(entry),
};


