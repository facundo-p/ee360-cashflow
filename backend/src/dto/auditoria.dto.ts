// DTOs de auditoría de movimientos.
// Registra cada cambio según business-rules.md sección 2.1

export type AuditoriaMovimientoDTO = {
  id: string;
  movimiento_id: string;
  usuario_id: string;
  campo: string;
  valor_anterior: string;
  valor_nuevo: string;
  fecha: string;
};

export type AuditoriaCreateDTO = {
  movimiento_id: string;
  usuario_id: string;
  campo: string;
  valor_anterior: string;
  valor_nuevo: string;
};

// Para consultar historial de cambios
export type AuditoriaFiltrosDTO = {
  movimiento_id?: string;
  usuario_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
};
