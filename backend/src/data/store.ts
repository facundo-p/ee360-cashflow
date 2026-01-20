// In-memory store for development/testing
// This will be replaced by SQLite persistence later

import {
  CategoriaDTO,
} from '../dto/categorias.dto';
import {
  MedioPagoDTO,
} from '../dto/medios.dto';
import {
  OpcionMovimientoDTO,
  OpcionMovimientoEnriquecidaDTO,
} from '../dto/opciones.dto';
import {
  MovimientoDTO,
  MovimientoEnriquecidoDTO,
} from '../dto/movimientos.dto';
import {
  UsuarioDTO,
} from '../dto/usuarios.dto';
import {
  AuditoriaMovimientoDTO,
} from '../dto/auditoria.dto';

// ============================================================
// Seed Data
// ============================================================

const categoriasSeed: CategoriaDTO[] = [
  {
    id: 'cat-clase',
    nombre: 'Clase suelta',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-plan-mensual',
    nombre: 'Plan mensual',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-plan-semestral',
    nombre: 'Plan semestral',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-clase-kids',
    nombre: 'Clase kids',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-plan-kids',
    nombre: 'Plan kids',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-bebida',
    nombre: 'Venta de bebida',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-merch',
    nombre: 'Venta merch',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-otros-ingreso',
    nombre: 'Otros ingresos',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-otros-egreso',
    nombre: 'Otros egresos',
    sentido: 'egreso',
    es_plan: false,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const mediosSeed: MedioPagoDTO[] = [
  { id: 'm-efectivo', nombre: 'Efectivo', activo: true, orden: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-transf', nombre: 'Transferencia', activo: true, orden: 2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-mp', nombre: 'Mercado Pago', activo: true, orden: 3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-debito', nombre: 'Débito', activo: true, orden: 4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-credito', nombre: 'Crédito', activo: true, orden: 5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

const opcionesSeed: OpcionMovimientoDTO[] = [
  {
    id: 't-clase-efectivo',
    categoria_id: 'cat-clase',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Clase suelta',
    icono: 'clase_individual.png',
    monto_sugerido: 10000,
    activo: true,
    orden: 1,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-efectivo',
    categoria_id: 'cat-plan-mensual',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Plan mensual - Efectivo',
    icono: 'plan_mensual_efectivo.png',
    monto_sugerido: 70000,
    activo: true,
    orden: 2,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-transferencia',
    categoria_id: 'cat-plan-mensual',
    medio_pago_id: 'm-transf',
    nombre_display: 'Plan mensual - Transferencia',
    icono: 'plan_mensual_transferencia.png',
    monto_sugerido: 80000,
    activo: true,
    orden: 3,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-semestral-efectivo',
    categoria_id: 'cat-plan-semestral',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Plan semestral - Efectivo',
    icono: 'plan_semestral_efectivo.png',
    monto_sugerido: 350000,
    activo: true,
    orden: 4,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-semestral-tarjeta',
    categoria_id: 'cat-plan-semestral',
    medio_pago_id: 'm-credito',
    nombre_display: 'Plan semestral - Tarjeta',
    icono: 'plan_semestral_tarjeta.png',
    monto_sugerido: 420000,
    activo: true,
    orden: 5,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-kids-clase',
    categoria_id: 'cat-clase-kids',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Clase kids',
    icono: 'clase_kids.png',
    monto_sugerido: 15000,
    activo: true,
    orden: 6,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-kids-mensual',
    categoria_id: 'cat-plan-kids',
    medio_pago_id: 'm-transf',
    nombre_display: 'Plan kids 1x semana',
    icono: 'plan_kids_1x.png',
    monto_sugerido: 40000,
    activo: true,
    orden: 7,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-plan-kids-mensual-2',
    categoria_id: 'cat-plan-kids',
    medio_pago_id: 'm-transf',
    nombre_display: 'Plan kids 2x semana',
    icono: 'plan_kids_2x.png',
    monto_sugerido: 70000,
    activo: true,
    orden: 8,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-bebida',
    categoria_id: 'cat-bebida',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Venta de bebida',
    icono: 'bebida.png',
    monto_sugerido: 800,
    activo: true,
    orden: 9,
    fecha_actualizacion_precio: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-merch',
    categoria_id: 'cat-merch',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Venta merch',
    icono: 'merchandising.png',
    monto_sugerido: null,
    activo: true,
    orden: 10,
    fecha_actualizacion_precio: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-otros-ingreso',
    categoria_id: 'cat-otros-ingreso',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Otros - ingreso',
    icono: 'otros_ingreso.png',
    monto_sugerido: null,
    activo: true,
    orden: 11,
    fecha_actualizacion_precio: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 't-otros-egreso',
    categoria_id: 'cat-otros-egreso',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Otros - egreso',
    icono: 'otros_egreso.png',
    monto_sugerido: null,
    activo: true,
    orden: 12,
    fecha_actualizacion_precio: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const usuariosSeed: UsuarioDTO[] = [
  { id: 'u-admin', nombre: 'Admin Demo', email: 'admin@gym.test', rol: 'admin', estado: 'activo' },
  { id: 'u-user', nombre: 'Coach Demo', email: 'coach@gym.test', rol: 'usuario', estado: 'activo' },
];

const movimientosSeed: MovimientoDTO[] = [
  {
    id: 'mov-1',
    fecha: new Date().toISOString().slice(0, 10), // Today
    opcion_id: 't-plan-efectivo',
    monto: 70000,
    nombre_cliente: 'Juan Pérez',
    nota: 'Cuota mensual',
    created_by_user_id: 'u-admin',
    created_at: new Date().toISOString(),
    updated_by_user_id: null,
    updated_at: null,
  },
];

// ============================================================
// Store State
// ============================================================

interface StoreState {
  categorias: CategoriaDTO[];
  medios: MedioPagoDTO[];
  opciones: OpcionMovimientoDTO[];
  usuarios: UsuarioDTO[];
  movimientos: MovimientoDTO[];
  auditoria: AuditoriaMovimientoDTO[];
}

let store: StoreState = {
  categorias: [...categoriasSeed],
  medios: [...mediosSeed],
  opciones: [...opcionesSeed],
  usuarios: [...usuariosSeed],
  movimientos: [...movimientosSeed],
  auditoria: [],
};

// ============================================================
// Store Operations
// ============================================================

export const Store = {
  // Reset to initial state (useful for testing)
  reset: () => {
    store = {
      categorias: [...categoriasSeed],
      medios: [...mediosSeed],
      opciones: [...opcionesSeed],
      usuarios: [...usuariosSeed],
      movimientos: [...movimientosSeed],
      auditoria: [],
    };
  },

  // ==================== Categorias ====================
  categorias: {
    list: (soloActivas = false): CategoriaDTO[] => {
      return soloActivas 
        ? store.categorias.filter(c => c.activo)
        : [...store.categorias];
    },
    
    findById: (id: string): CategoriaDTO | null => {
      return store.categorias.find(c => c.id === id) ?? null;
    },
    
    findByNombre: (nombre: string): CategoriaDTO | null => {
      return store.categorias.find(c => c.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;
    },
    
    create: (data: Omit<CategoriaDTO, 'created_at' | 'updated_at'>): CategoriaDTO => {
      const now = new Date().toISOString();
      const categoria: CategoriaDTO = {
        ...data,
        id: `cat-${Date.now()}`,
        created_at: now,
        updated_at: now,
      };
      store.categorias.push(categoria);
      return categoria;
    },
    
    update: (id: string, data: Partial<CategoriaDTO>): CategoriaDTO | null => {
      const idx = store.categorias.findIndex(c => c.id === id);
      if (idx === -1) return null;
      store.categorias[idx] = {
        ...store.categorias[idx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return store.categorias[idx];
    },
    
    hasActiveOpciones: (categoriaId: string): boolean => {
      return store.opciones.some(o => o.categoria_id === categoriaId && o.activo);
    },
  },

  // ==================== Medios ====================
  medios: {
    list: (soloActivos = false): MedioPagoDTO[] => {
      const result = soloActivos 
        ? store.medios.filter(m => m.activo)
        : [...store.medios];
      return result.sort((a, b) => a.orden - b.orden);
    },
    
    findById: (id: string): MedioPagoDTO | null => {
      return store.medios.find(m => m.id === id) ?? null;
    },
    
    findByNombre: (nombre: string): MedioPagoDTO | null => {
      return store.medios.find(m => m.nombre.toLowerCase() === nombre.toLowerCase().trim()) ?? null;
    },
    
    create: (data: Omit<MedioPagoDTO, 'created_at' | 'updated_at'>): MedioPagoDTO => {
      const now = new Date().toISOString();
      const medio: MedioPagoDTO = {
        ...data,
        id: `m-${Date.now()}`,
        created_at: now,
        updated_at: now,
      };
      store.medios.push(medio);
      return medio;
    },
    
    update: (id: string, data: Partial<MedioPagoDTO>): MedioPagoDTO | null => {
      const idx = store.medios.findIndex(m => m.id === id);
      if (idx === -1) return null;
      store.medios[idx] = {
        ...store.medios[idx],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return store.medios[idx];
    },
    
    hasActiveOpciones: (medioId: string): boolean => {
      return store.opciones.some(o => o.medio_pago_id === medioId && o.activo);
    },
  },

  // ==================== Opciones ====================
  opciones: {
    list: (soloActivas = false): OpcionMovimientoDTO[] => {
      const result = soloActivas 
        ? store.opciones.filter(o => o.activo)
        : [...store.opciones];
      return result.sort((a, b) => a.orden - b.orden);
    },
    
    listEnriquecidas: (soloActivas = false): OpcionMovimientoEnriquecidaDTO[] => {
      const opciones = Store.opciones.list(soloActivas);
      return opciones.map(o => {
        const categoria = Store.categorias.findById(o.categoria_id);
        const medio = Store.medios.findById(o.medio_pago_id);
        return {
          ...o,
          categoria_nombre: categoria?.nombre ?? '',
          categoria_sentido: categoria?.sentido ?? 'ingreso',
          medio_pago_nombre: medio?.nombre ?? '',
        };
      });
    },
    
    findById: (id: string): OpcionMovimientoDTO | null => {
      return store.opciones.find(o => o.id === id) ?? null;
    },
    
    findByIdEnriquecida: (id: string): OpcionMovimientoEnriquecidaDTO | null => {
      const opcion = Store.opciones.findById(id);
      if (!opcion) return null;
      const categoria = Store.categorias.findById(opcion.categoria_id);
      const medio = Store.medios.findById(opcion.medio_pago_id);
      return {
        ...opcion,
        categoria_nombre: categoria?.nombre ?? '',
        categoria_sentido: categoria?.sentido ?? 'ingreso',
        medio_pago_nombre: medio?.nombre ?? '',
      };
    },
    
    findByCategoriaMedio: (categoriaId: string, medioId: string): OpcionMovimientoDTO | null => {
      return store.opciones.find(
        o => o.categoria_id === categoriaId && o.medio_pago_id === medioId
      ) ?? null;
    },
    
    create: (data: Omit<OpcionMovimientoDTO, 'created_at' | 'updated_at'>): OpcionMovimientoDTO => {
      const now = new Date().toISOString();
      const opcion: OpcionMovimientoDTO = {
        ...data,
        id: `t-${Date.now()}`,
        created_at: now,
        updated_at: now,
      };
      store.opciones.push(opcion);
      return opcion;
    },
    
    update: (id: string, data: Partial<OpcionMovimientoDTO>): OpcionMovimientoDTO | null => {
      const idx = store.opciones.findIndex(o => o.id === id);
      if (idx === -1) return null;
      
      const now = new Date().toISOString();
      const updates: Partial<OpcionMovimientoDTO> = {
        ...data,
        updated_at: now,
      };
      
      // If price changed, update price date
      if (data.monto_sugerido !== undefined && data.monto_sugerido !== store.opciones[idx].monto_sugerido) {
        updates.fecha_actualizacion_precio = now;
      }
      
      store.opciones[idx] = {
        ...store.opciones[idx],
        ...updates,
      };
      return store.opciones[idx];
    },
    
    countByCategoria: (categoriaId: string, soloActivas = true): number => {
      return store.opciones.filter(
        o => o.categoria_id === categoriaId && (!soloActivas || o.activo)
      ).length;
    },
    
    countByMedio: (medioId: string, soloActivas = true): number => {
      return store.opciones.filter(
        o => o.medio_pago_id === medioId && (!soloActivas || o.activo)
      ).length;
    },
    
    hasMovimientos: (opcionId: string): boolean => {
      return store.movimientos.some(m => m.opcion_id === opcionId);
    },
  },

  // ==================== Usuarios ====================
  usuarios: {
    list: (): UsuarioDTO[] => {
      return [...store.usuarios];
    },
    
    findById: (id: string): UsuarioDTO | null => {
      return store.usuarios.find(u => u.id === id) ?? null;
    },
    
    findByEmail: (email: string): UsuarioDTO | null => {
      return store.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
    },
  },

  // ==================== Movimientos ====================
  movimientos: {
    list: (): MovimientoDTO[] => {
      return [...store.movimientos].sort((a, b) => 
        b.fecha.localeCompare(a.fecha) || b.created_at.localeCompare(a.created_at)
      );
    },
    
    listEnriquecidos: (): MovimientoEnriquecidoDTO[] => {
      return Store.movimientos.list().map(m => {
        const opcion = Store.opciones.findByIdEnriquecida(m.opcion_id);
        const creador = Store.usuarios.findById(m.created_by_user_id);
        const editor = m.updated_by_user_id ? Store.usuarios.findById(m.updated_by_user_id) : null;
        return {
          ...m,
          opcion_nombre: opcion?.nombre_display ?? '',
          categoria_nombre: opcion?.categoria_nombre ?? '',
          categoria_sentido: opcion?.categoria_sentido ?? 'ingreso',
          medio_pago_nombre: opcion?.medio_pago_nombre ?? '',
          icono: opcion?.icono ?? 'default.png',
          created_by_nombre: creador?.nombre ?? '',
          updated_by_nombre: editor?.nombre ?? null,
        };
      });
    },
    
    findById: (id: string): MovimientoDTO | null => {
      return store.movimientos.find(m => m.id === id) ?? null;
    },
    
    findByIdEnriquecido: (id: string): MovimientoEnriquecidoDTO | null => {
      const mov = Store.movimientos.findById(id);
      if (!mov) return null;
      const opcion = Store.opciones.findByIdEnriquecida(mov.opcion_id);
      const creador = Store.usuarios.findById(mov.created_by_user_id);
      const editor = mov.updated_by_user_id ? Store.usuarios.findById(mov.updated_by_user_id) : null;
      return {
        ...mov,
        opcion_nombre: opcion?.nombre_display ?? '',
        categoria_nombre: opcion?.categoria_nombre ?? '',
        categoria_sentido: opcion?.categoria_sentido ?? 'ingreso',
        medio_pago_nombre: opcion?.medio_pago_nombre ?? '',
        icono: opcion?.icono ?? 'default.png',
        created_by_nombre: creador?.nombre ?? '',
        updated_by_nombre: editor?.nombre ?? null,
      };
    },
    
    findDuplicado: (params: {
      opcion_id: string;
      monto: number;
      nombre_cliente: string | null;
      fecha: string;
    }): MovimientoDTO | null => {
      return store.movimientos.find(m =>
        m.opcion_id === params.opcion_id &&
        m.monto === params.monto &&
        m.fecha === params.fecha &&
        (m.nombre_cliente ?? '') === (params.nombre_cliente ?? '')
      ) ?? null;
    },
    
    create: (data: Omit<MovimientoDTO, 'created_at' | 'updated_at' | 'updated_by_user_id'>): MovimientoDTO => {
      const now = new Date().toISOString();
      const movimiento: MovimientoDTO = {
        ...data,
        id: `mov-${Date.now()}`,
        created_at: now,
        updated_by_user_id: null,
        updated_at: null,
      };
      store.movimientos.unshift(movimiento);
      return movimiento;
    },
    
    update: (id: string, data: Partial<MovimientoDTO>, userId: string): MovimientoDTO | null => {
      const idx = store.movimientos.findIndex(m => m.id === id);
      if (idx === -1) return null;
      store.movimientos[idx] = {
        ...store.movimientos[idx],
        ...data,
        updated_by_user_id: userId,
        updated_at: new Date().toISOString(),
      };
      return store.movimientos[idx];
    },
    
    countByOpcion: (opcionId: string): number => {
      return store.movimientos.filter(m => m.opcion_id === opcionId).length;
    },
  },

  // ==================== Auditoria ====================
  auditoria: {
    list: (): AuditoriaMovimientoDTO[] => {
      return [...store.auditoria].sort((a, b) => 
        b.cambiado_en.localeCompare(a.cambiado_en)
      );
    },
    
    getByMovimiento: (movimientoId: string): AuditoriaMovimientoDTO[] => {
      return store.auditoria
        .filter(a => a.movimiento_id === movimientoId)
        .sort((a, b) => b.cambiado_en.localeCompare(a.cambiado_en));
    },
    
    log: (data: Omit<AuditoriaMovimientoDTO, 'id' | 'cambiado_en'>): AuditoriaMovimientoDTO => {
      const entry: AuditoriaMovimientoDTO = {
        ...data,
        id: store.auditoria.length + 1,
        cambiado_en: new Date().toISOString(),
      };
      store.auditoria.push(entry);
      return entry;
    },
    
    logMultiple: (entries: Array<Omit<AuditoriaMovimientoDTO, 'id' | 'cambiado_en'>>): void => {
      const now = new Date().toISOString();
      entries.forEach(data => {
        store.auditoria.push({
          ...data,
          id: store.auditoria.length + 1,
          cambiado_en: now,
        });
      });
    },
  },
};
