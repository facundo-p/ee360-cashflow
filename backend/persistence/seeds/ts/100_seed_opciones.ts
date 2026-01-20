// persistence/seeds/ts/010_opciones.ts
import { getDb } from '../../sqlite';
import { randomUUID } from 'crypto';

export async function run() {
  const db = getDb();

  const opciones = [
    {
        categoria_id: 'cat_clase_suelta',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Clase suelta',
        icono: 'clase_individual.png',
        monto_sugerido: 10000,
        activo: true,
        orden: 1,
      },
      {
        categoria_id: 'cat_plan_mensual',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Plan mensual - Efectivo',
        icono: 'plan_mensual_efectivo.png',
        monto_sugerido: 70000,
        activo: true,
        orden: 2,
      },
      {
        categoria_id: 'cat_plan_mensual',
        medio_pago_id: 'm_transferencia',
        nombre_display: 'Plan mensual - Transferencia',
        icono: 'plan_mensual_transferencia.png',
        monto_sugerido: 80000,
        activo: true,
        orden: 3,
      },
      {
        categoria_id: 'cat_plan_semestral',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Plan semestral - Efectivo',
        icono: 'plan_semestral_efectivo.png',
        monto_sugerido: 350000,
        activo: true,
        orden: 4,
      },
      {
        categoria_id: 'cat_plan_semestral',
        medio_pago_id: 'm_credito',
        nombre_display: 'Plan semestral - Tarjeta',
        icono: 'plan_semestral_tarjeta.png',
        monto_sugerido: 420000,
        activo: true,
        orden: 5,
      },
      {
        categoria_id: 'cat_clase_kids',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Clase kids',
        icono: 'clase_kids.png',
        monto_sugerido: 15000,
        activo: true,
        orden: 6,
      },
      {
        categoria_id: 'cat_plan_kids_1x_semana',
        medio_pago_id: 'm_transferencia',
        nombre_display: 'Plan kids 1x semana',
        icono: 'plan_kids_1x.png',
        monto_sugerido: 40000,
        activo: true,
        orden: 7,
      },
      {
        categoria_id: 'cat_plan_kids_2x_semana',
        medio_pago_id: 'm_transferencia',
        nombre_display: 'Plan kids 2x semana',
        icono: 'plan_kids_2x.png',
        monto_sugerido: 70000,
        activo: true,
        orden: 8,
      },
      {
        categoria_id: 'cat_bebida',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Venta de bebida',
        icono: 'bebida.png',
        monto_sugerido: 800,
        activo: true,
        orden: 9,
      },
      {
        categoria_id: 'cat_merch',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Venta merch',
        icono: 'merchandising.png',
        monto_sugerido: null,
        activo: true,
        orden: 10,
      },
      {
        categoria_id: 'cat_otros_ingreso',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Otros - ingreso',
        icono: 'otros_ingreso.png',
        monto_sugerido: null,
        activo: true,
        orden: 11,
      },
      {
        categoria_id: 'cat_otros_egreso',
        medio_pago_id: 'm_efectivo',
        nombre_display: 'Otros - egreso',
        icono: 'otros_egreso.png',
        monto_sugerido: null,
        activo: true,
        orden: 12,
      },
  ]

  const stmt = db.prepare(`
    INSERT INTO opciones_movimiento (
      id,
      categoria_id,
      medio_pago_id,
      nombre_display,
      icono,
      monto_sugerido,
      activo,
      orden,
      fecha_actualizacion_precio,
      created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(categoria_id, medio_pago_id) DO NOTHING;
  `);

  const now = new Date().toISOString();
  for (const o of opciones) {
    stmt.run(
      randomUUID(),
      o.categoria_id,
      o.medio_pago_id,
      o.nombre_display,
      o.icono,
      o.monto_sugerido,
      o.activo ? 1 : 0,
      o.orden,
      now,
      now
    );
  }
}
