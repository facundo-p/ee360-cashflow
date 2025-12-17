// Registro de auditoría de movimientos (placeholder).
export type AuditLog = {
  id?: number;
  movimiento_id: string;
  usuario_id: string;
  campo: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  cambiado_en?: string;
};

export const AuditoriaRepo = {
  logChange: async (_entry: AuditLog) => undefined,
};


