// Categorías de movimiento (tipos base normalizados)
export type CategoriaMovimiento = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export const categoriasSeed: CategoriaMovimiento[] = [
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
