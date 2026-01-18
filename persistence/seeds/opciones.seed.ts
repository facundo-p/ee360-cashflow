import { getDb } from '../sqlite';
import { IdFactory } from '../../backend/src/utils/idFactory';

export const seedOpciones = () => {
  const db = getDb();
  const now = new Date().toISOString();

  const opciones = [
    {
      categoria: 'cat_clase_suelta',
      medio: 'm_efectivo',
      nombre: 'Clase suelta',
      icono: 'clase_individual.png',
      monto: 10000,
      orden: 1,
    },
    {
      categoria: 'cat_plan_mensual',
      medio: 'm_efectivo',
      nombre: 'Plan mensual - Efectivo',
      icono: 'plan_mensual_efectivo.png',
      monto: 70000,
      orden: 2,
    },
    {
      categoria: 'cat_plan_mensual',
      medio: 'm_transferencia',
      nombre: 'Plan mensual - Transferencia',
      icono: 'plan_mensual_transferencia.png',
      monto: 80000,
      orden: 3,
    },
    {
      categoria: 'cat_plan_semestral',
      medio: 'm_efectivo',
      nombre: 'Plan semestral - Efectivo',
      icono: 'plan_semestral_efectivo.png',
      monto: 350000,
      orden: 4,
    },
    {
      categoria: 'cat_plan_semestral',
      medio: 'm_credito',
      nombre: 'Plan semestral - Tarjeta',
      icono: 'plan_semestral_tarjeta.png',
      monto: 420000,
      orden: 5,
    },
    {
      categoria: 'cat_clase_kids',
      medio: 'm_efectivo',
      nombre: 'Clase kids',
      icono: 'clase_kids.png',
      monto: 15000,
      orden: 6,
    },
    {
      categoria: 'cat_plan_kids_1x',
      medio: 'm_transferencia',
      nombre: 'Plan kids 1x semana',
      icono: 'plan_kids_1x.png',
      monto: 40000,
      orden: 7,
    },
    {
      categoria: 'cat_plan_kids_2x',
      medio: 'm_transferencia',
      nombre: 'Plan kids 2x semana',
      icono: 'plan_kids_2x.png',
      monto: 70000,
      orden: 8,
    },
    {
      categoria: 'cat_bebida',
      medio: 'm_efectivo',
      nombre: 'Venta de bebida',
      icono: 'bebida.png',
      monto: 800,
      orden: 9,
    },
    {
      categoria: 'cat_merch',
      medio: 'm_efectivo',
      nombre: 'Venta merch',
      icono: 'merchandising.png',
      monto: null,
      orden: 10,
    },
    {
      categoria: 'cat_otros_ingreso',
      medio: 'm_efectivo',
      nombre: 'Otros - ingreso',
      icono: 'otros_ingreso.png',
      monto: null,
      orden: 11,
    },
    {
      categoria: 'cat_otros_egreso',
      medio: 'm_efectivo',
      nombre: 'Otros - egreso',
      icono: 'otros_egreso.png',
      monto: null,
      orden: 12,
    },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO opciones_movimiento (
      id,
      categoria_id,
      medio_pago_id,
      nombre_display,
      icono,
      monto_sugerido,
      activo,
      orden,
      fecha_actualizacion_precio,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const o of opciones) {
      insert.run(
        IdFactory.opcion(),
        o.categoria,
        o.medio,
        o.nombre,
        o.icono,
        o.monto,
        o.orden,
        o.monto ? now : null,
        now,
        now
      );
    }
  });

  tx();
};
