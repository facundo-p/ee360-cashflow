// API calls for Movimientos
import api from './client';

export type Movimiento = {
  id: string;
  fecha: string;
  opcion_id: string;
  monto: number;
  nombre_cliente: string | null;
  nota: string | null;
  created_by_user_id: string;
  created_at: string;
  updated_by_user_id: string | null;
  updated_at: string | null;
};

export type MovimientoEnriquecido = Movimiento & {
  opcion_nombre: string;
  categoria_nombre: string;
  categoria_sentido: 'ingreso' | 'egreso';
  medio_pago_nombre: string;
  icono: string;
  created_by_nombre: string;
  updated_by_nombre: string | null;
};

export type MovimientoCreateInput = {
  fecha: string;
  opcion_id: string;
  monto: number;
  nombre_cliente?: string | null;
  nota?: string | null;
  confirmar_duplicado?: boolean;
};

export type MovimientoUpdateInput = Partial<Omit<MovimientoCreateInput, 'confirmar_duplicado'>>;

export type MovimientoFiltros = {
  fecha_desde?: string;
  fecha_hasta?: string;
  opcion_id?: string;
  categoria_id?: string;
  medio_pago_id?: string;
};

export type CreateMovimientoResult = {
  movimiento?: Movimiento;
  created: boolean;
  warning?: string;
  movimiento_duplicado_id?: string;
  requires_confirmation?: boolean;
};

// Build query string from filters
function buildQueryString(filtros?: MovimientoFiltros): string {
  if (!filtros) return '';
  const params = new URLSearchParams();
  if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
  if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
  if (filtros.opcion_id) params.append('opcion_id', filtros.opcion_id);
  if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id);
  if (filtros.medio_pago_id) params.append('medio_pago_id', filtros.medio_pago_id);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// List movimientos with filters
export async function listMovimientos(filtros?: MovimientoFiltros): Promise<MovimientoEnriquecido[]> {
  return api.get<MovimientoEnriquecido[]>(`/movimientos${buildQueryString(filtros)}`);
}

// Get single movimiento by ID
export async function getMovimiento(id: string): Promise<MovimientoEnriquecido | null> {
  try {
    return await api.get<MovimientoEnriquecido>(`/movimientos/${id}`);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Create new movimiento
export async function createMovimiento(input: MovimientoCreateInput): Promise<CreateMovimientoResult> {
  return api.post<CreateMovimientoResult>('/movimientos', input);
}

// Update movimiento
export async function updateMovimiento(id: string, updates: MovimientoUpdateInput): Promise<Movimiento | null> {
  try {
    return await api.put<Movimiento>(`/movimientos/${id}`, updates);
  } catch (e) {
    if ((e as any).status === 404) return null;
    throw e;
  }
}

// Check if user can edit movimiento
export async function puedeEditarMovimiento(id: string): Promise<{ permitido: boolean; razon?: string }> {
  return api.get<{ permitido: boolean; razon?: string }>(`/movimientos/${id}/puede-editar`);
}

// Get audit history for movimiento
export async function getHistorialMovimiento(id: string): Promise<Array<{
  id: number;
  campo: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  cambiado_en: string;
  usuario_nombre?: string;
}>> {
  return api.get(`/movimientos/${id}/historial`);
}
