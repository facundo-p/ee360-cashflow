// DTOs de movimientos.
export type MovimientoCreateDTO = {
  fecha: string;
  tipo_movimiento_id: string;
  monto: number;
  medio_pago_id: string;
  nombre_cliente?: string | null;
  nota?: string | null;
};

export type MovimientoDTO = MovimientoCreateDTO & {
  id: string;
  sentido: 'ingreso' | 'egreso';
  usuario_creador_id: string;
  created_at: string;
  updated_at: string;
};


