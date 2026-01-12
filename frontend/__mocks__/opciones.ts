// Opciones de movimiento: combinación de Categoría + Medio de Pago + Monto sugerido
// IDs compatibles con el modelo anterior (tipo_movimiento_id en movimientos)
export type OpcionMovimiento = {
  id: string;
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  icono: string;
  monto_sugerido: number | null;
  activo: boolean;
  orden: number;
  fecha_actualizacion: string;
};

export const opcionesSeed: OpcionMovimiento[] = [
  {
    id: 't-clase-efectivo', // Mantiene ID legacy
    categoria_id: 'cat-clase',
    medio_pago_id: 'm-efectivo',
    nombre_display: 'Clase suelta',
    icono: 'clase_individual.png',
    monto_sugerido: 10000,
    activo: true,
    orden: 1,
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
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
    fecha_actualizacion: '2024-01-01',
  },
];
