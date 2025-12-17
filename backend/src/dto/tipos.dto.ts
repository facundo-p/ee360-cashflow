// DTOs de tipos de movimiento (plantillas).
export type TipoMovimientoDTO = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  monto_sugerido: number | null;
  medio_pago_id: string | null;
  es_plan: boolean;
  activo: boolean;
};


