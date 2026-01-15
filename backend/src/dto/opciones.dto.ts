// DTOs de opciones de movimiento.
// Combina categoría + medio de pago + configuración específica.

export type OpcionMovimientoDTO = {
  id: string;
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  monto_sugerido: number | null;
  icono: string;
  activo: boolean;
  orden: number;
  fecha_actualizacion_precio: string | null;
  created_at: string;
  updated_at: string;
};

// Vista enriquecida con datos de categoría y medio
export type OpcionMovimientoEnriquecidaDTO = OpcionMovimientoDTO & {
  categoria_nombre: string;
  categoria_sentido: 'ingreso' | 'egreso';
  medio_pago_nombre: string;
};

export type OpcionCreateDTO = {
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  monto_sugerido?: number | null;
  icono?: string;
  orden?: number;
};

export type OpcionUpdateDTO = Partial<Omit<OpcionCreateDTO, 'categoria_id' | 'medio_pago_id'>> & {
  activo?: boolean;
};

// Para actualización masiva de precios
export type AumentoPreciosDTO = {
  porcentaje: number; // ej: 10 para 10%
  opcion_ids?: string[]; // si está vacío, aplica a todas las activas
  redondear_a?: number; // ej: 100 para redondear a centenas
};

export type AumentoPreciosResultDTO = {
  actualizadas: number;
  detalles: Array<{
    opcion_id: string;
    nombre: string;
    precio_anterior: number;
    precio_nuevo: number;
  }>;
};
