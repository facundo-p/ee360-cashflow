// Categorías de movimiento (tipos base normalizados)
export type CategoriaMovimiento = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

export const categoriasSeed: CategoriaMovimiento[] = [
  {
    id: 'cat-clase',
    nombre: 'Clase suelta',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-plan-mensual',
    nombre: 'Plan mensual',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-plan-semestral',
    nombre: 'Plan semestral',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-clase-kids',
    nombre: 'Clase kids',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-plan-kids',
    nombre: 'Plan kids',
    sentido: 'ingreso',
    es_plan: true,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-bebida',
    nombre: 'Venta de bebida',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-merch',
    nombre: 'Venta merch',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-otros-ingreso',
    nombre: 'Otros ingresos',
    sentido: 'ingreso',
    es_plan: false,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
  {
    id: 'cat-otros-egreso',
    nombre: 'Otros egresos',
    sentido: 'egreso',
    es_plan: false,
    activo: true,
    fecha_creacion: '2024-01-01',
    fecha_actualizacion: '2024-01-01',
  },
];
