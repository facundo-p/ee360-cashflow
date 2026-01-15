import { seed } from '../../__mocks__/seed';

type Medio = (typeof seed.medios)[number];
type Tipo = (typeof seed.tipos)[number];
type Usuario = (typeof seed.usuarios)[number];
type Movimiento = (typeof seed.movimientos)[number];

// Enriched movimiento for API response
type MovimientoEnriquecido = Movimiento & {
  opcion_id: string;
  opcion_nombre: string;
  categoria_nombre: string;
  categoria_sentido: 'ingreso' | 'egreso';
  medio_pago_nombre: string;
  icono: string;
  created_by_nombre: string;
};

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

// Helper to enrich a movement with related data
function enriquecerMovimiento(m: Movimiento): MovimientoEnriquecido {
  const tipoId = m.tipo_movimiento_id;
  const tipo = db.tipos.find((t) => t.id === tipoId);
  const medio = db.medios.find((med) => med.id === m.medio_pago_id);
  const usuario = db.usuarios.find((u) => u.id === m.usuario_creador_id);
  
  return {
    ...m,
    opcion_id: tipoId,
    opcion_nombre: tipo?.nombre ?? 'Movimiento',
    categoria_nombre: tipo?.nombre ?? '',
    categoria_sentido: (tipo?.sentido ?? m.sentido ?? 'ingreso') as 'ingreso' | 'egreso',
    medio_pago_nombre: medio?.nombre ?? m.medio_pago_id,
    icono: tipo?.icono ?? 'default.png',
    created_by_nombre: usuario?.nombre ?? m.usuario_creador_id,
  };
}

export function listMovimientos(): MovimientoEnriquecido[] {
  return db.movimientos.map(enriquecerMovimiento);
}

export function findMovimiento(id: string): MovimientoEnriquecido | undefined {
  const m = db.movimientos.find((mov) => mov.id === id);
  return m ? enriquecerMovimiento(m) : undefined;
}

// Busca un posible duplicado basado en tipo, monto, nombre_cliente y fecha
export function findDuplicado(payload: {
  opcion_id?: string;
  tipo_movimiento_id?: string;
  monto: number;
  nombre_cliente?: string | null;
  fecha: string;
}): Movimiento | undefined {
  const tipoId = payload.opcion_id ?? payload.tipo_movimiento_id;
  return db.movimientos.find(
    (m) =>
      m.tipo_movimiento_id === tipoId &&
      m.monto === payload.monto &&
      m.fecha === payload.fecha &&
      (m.nombre_cliente ?? '') === (payload.nombre_cliente ?? '')
  );
}

export type CreateMovimientoResult = {
  created: boolean;
  movimiento?: MovimientoEnriquecido;
  requires_confirmation?: boolean;
  warning?: string;
  movimiento_duplicado_id?: string;
};

export function createMovimiento(
  payload: Partial<Movimiento> & { opcion_id?: string; confirmar_duplicado?: boolean }
): CreateMovimientoResult {
  // Support both opcion_id (new) and tipo_movimiento_id (legacy)
  const tipoId = payload.opcion_id ?? payload.tipo_movimiento_id;
  const tipo = db.tipos.find((t) => t.id === tipoId);
  
  // Detectar posible duplicado
  const duplicado = findDuplicado({
    opcion_id: tipoId,
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
    tipo_movimiento_id: tipoId!,
    sentido: tipo?.sentido ?? payload.sentido ?? 'ingreso',
    monto: payload.monto ?? 0,
    medio_pago_id: tipo?.medio_pago_id ?? payload.medio_pago_id ?? 'm-efectivo',
    nombre_cliente: payload.nombre_cliente ?? null,
    nota: payload.nota ?? null,
    usuario_creador_id: payload.usuario_creador_id ?? 'u-user',
    created_at: now,
    updated_at: now,
  };
  db.movimientos = [nuevo, ...db.movimientos];

  const result: CreateMovimientoResult = { 
    created: true, 
    movimiento: enriquecerMovimiento(nuevo) 
  };
  
  if (duplicado) {
    // Se creó a pesar de duplicado (usuario confirmó)
    result.warning = 'posible_movimiento_duplicado';
    result.movimiento_duplicado_id = duplicado.id;
  }

  return result;
}

export function updateMovimiento(id: string, payload: Partial<Movimiento>): MovimientoEnriquecido | undefined {
  const found = db.movimientos.find((m) => m.id === id);
  if (!found) return;
  const updated = { ...found, ...payload, updated_at: new Date().toISOString() };
  db.movimientos = db.movimientos.map((m) => (m.id === id ? updated : m));
  return enriquecerMovimiento(updated);
}

export function getTotalesDelDia(fecha: string) {
  const hoy = fecha;
  const delDia = db.movimientos.filter((m) => m.fecha === hoy);
  const ingresos = delDia.filter((m) => m.sentido === 'ingreso').reduce((a, b) => a + (b.monto ?? 0), 0);
  const egresos = delDia.filter((m) => m.sentido === 'egreso').reduce((a, b) => a + (b.monto ?? 0), 0);
  return { ingresos, egresos, balance: ingresos - egresos, fecha: hoy };
}
