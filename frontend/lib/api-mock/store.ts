import { seed } from '../../__mocks__/seed';

type Medio = (typeof seed.medios)[number];
type Tipo = (typeof seed.tipos)[number];
type Usuario = (typeof seed.usuarios)[number];
type Movimiento = (typeof seed.movimientos)[number];

let db = {
  medios: [...seed.medios],
  tipos: [...seed.tipos],
  usuarios: [...seed.usuarios],
  movimientos: [...seed.movimientos],
};

export function resetStore() {
  db = {
    medios: [...seed.medios],
    tipos: [...seed.tipos],
    usuarios: [...seed.usuarios],
    movimientos: [...seed.movimientos],
  };
}

export function listMedios(): Medio[] {
  return db.medios.filter((m) => m.activo);
}

export function listTipos(): Tipo[] {
  return db.tipos.filter((t) => t.activo);
}

export function listUsuarios(): Usuario[] {
  return db.usuarios;
}

export function findUsuarioByEmail(email: string): Usuario | undefined {
  return db.usuarios.find((u) => u.email === email);
}

export function listMovimientos(): Movimiento[] {
  return db.movimientos;
}

export function findMovimiento(id: string): Movimiento | undefined {
  return db.movimientos.find((m) => m.id === id);
}

// Busca un posible duplicado basado en tipo, monto, nombre_cliente y fecha
export function findDuplicado(payload: {
  tipo_movimiento_id: string;
  monto: number;
  nombre_cliente?: string | null;
  fecha: string;
}): Movimiento | undefined {
  return db.movimientos.find(
    (m) =>
      m.tipo_movimiento_id === payload.tipo_movimiento_id &&
      m.monto === payload.monto &&
      m.fecha === payload.fecha &&
      (m.nombre_cliente ?? '') === (payload.nombre_cliente ?? '')
  );
}

export type CreateMovimientoResult = {
  created: boolean;
  movimiento?: Movimiento;
  requires_confirmation?: boolean;
  warning?: string;
  movimiento_duplicado_id?: string;
};

export function createMovimiento(
  payload: Partial<Movimiento> & { confirmar_duplicado?: boolean }
): CreateMovimientoResult {
  // Detectar posible duplicado
  const duplicado = findDuplicado({
    tipo_movimiento_id: payload.tipo_movimiento_id!,
    monto: payload.monto ?? 0,
    nombre_cliente: payload.nombre_cliente,
    fecha: payload.fecha ?? new Date().toISOString().slice(0, 10),
  });

  // Si hay duplicado y no se confirmó, advertir sin crear
  if (duplicado && !payload.confirmar_duplicado) {
    return {
      created: false,
      requires_confirmation: true,
      warning: 'posible_movimiento_duplicado',
      movimiento_duplicado_id: duplicado.id,
    };
  }

  // Crear el movimiento
  const now = new Date().toISOString();
  const id = `mov-${Date.now()}`;
  const nuevo: Movimiento = {
    id,
    fecha: payload.fecha ?? now.slice(0, 10),
    tipo_movimiento_id: payload.tipo_movimiento_id!,
    sentido: payload.sentido ?? 'ingreso',
    monto: payload.monto ?? 0,
    medio_pago_id: payload.medio_pago_id!,
    nombre_cliente: payload.nombre_cliente ?? null,
    nota: payload.nota ?? null,
    usuario_creador_id: payload.usuario_creador_id ?? 'u-user',
    created_at: now,
    updated_at: now,
  };
  db.movimientos = [nuevo, ...db.movimientos];

  const result: CreateMovimientoResult = { 
    created: true, 
    movimiento: nuevo 
  };
  
  if (duplicado) {
    // Se creó a pesar de duplicado (usuario confirmó)
    result.warning = 'posible_movimiento_duplicado';
    result.movimiento_duplicado_id = duplicado.id;
  }

  return result;
}

export function updateMovimiento(id: string, payload: Partial<Movimiento>): Movimiento | undefined {
  const found = db.movimientos.find((m) => m.id === id);
  if (!found) return;
  const updated = { ...found, ...payload, updated_at: new Date().toISOString() };
  db.movimientos = db.movimientos.map((m) => (m.id === id ? updated : m));
  return updated;
}

export function getTotalesDelDia(fecha: string) {
  const hoy = fecha;
  const delDia = db.movimientos.filter((m) => m.fecha === hoy);
  const ingresos = delDia.filter((m) => m.sentido === 'ingreso').reduce((a, b) => a + (b.monto ?? 0), 0);
  const egresos = delDia.filter((m) => m.sentido === 'egreso').reduce((a, b) => a + (b.monto ?? 0), 0);
  return { ingresos, egresos, balance: ingresos - egresos, fecha: hoy };
}


