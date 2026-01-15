// DTOs de auditoría de movimientos.
// Registra cada cambio según business-rules.md sección 2.1

export type AuditoriaMovimientoDTO = {
  id: number;
  movimiento_id: string;
  usuario_id: string;
  campo: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  cambiado_en: string;
};

export type AuditoriaCreateDTO = {
  movimiento_id: string;
  usuario_id: string;
  campo: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
};

// Para consultar historial de cambios
export type AuditoriaFiltrosDTO = {
  movimiento_id?: string;
  usuario_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
};
