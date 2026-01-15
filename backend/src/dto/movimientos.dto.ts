// DTOs de movimientos.
// Respeta campos de auditoría según business-rules.md

export type MovimientoDTO = {
  id: string;
  fecha: string;
  opcion_id: string;
  monto: number;
  nombre_cliente: string | null;
  nota: string | null;
  // Campos de auditoría (sección 2.1)
  created_by_user_id: string;
  created_at: string;
  updated_by_user_id: string | null;
  updated_at: string | null;
};

// Vista enriquecida con datos de la opción
export type MovimientoEnriquecidoDTO = MovimientoDTO & {
  opcion_nombre: string;
  categoria_nombre: string;
  categoria_sentido: 'ingreso' | 'egreso';
  medio_pago_nombre: string;
  icono: string;
  created_by_nombre: string;
  updated_by_nombre: string | null;
};

export type MovimientoCreateDTO = {
  fecha: string;
  opcion_id: string;
  monto: number;
  nombre_cliente?: string | null;
  nota?: string | null;
  /** Si true, crea el movimiento aunque se detecte un posible duplicado */
  confirmar_duplicado?: boolean;
};

export type MovimientoUpdateDTO = Partial<Omit<MovimientoCreateDTO, 'confirmar_duplicado'>>;

// Filtros para listado
export type MovimientoFiltrosDTO = {
  fecha_desde?: string;
  fecha_hasta?: string;
  opcion_id?: string;
  categoria_id?: string;
  medio_pago_id?: string;
  created_by_user_id?: string;
};

// Respuesta de creación (sección 2.4)
export type MovimientoCreateResponseDTO = {
  /** El movimiento creado (solo presente si se creó) */
  movimiento?: MovimientoDTO;
  /** True si el movimiento fue creado exitosamente */
  created: boolean;
  /** Advertencia de posible duplicado */
  warning?: 'posible_movimiento_duplicado';
  /** ID del movimiento que podría ser duplicado */
  movimiento_duplicado_id?: string;
  /** True si se requiere confirmación del usuario para continuar */
  requires_confirmation?: boolean;
};
