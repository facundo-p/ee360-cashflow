INSERT INTO tipos_movimiento (id, nombre, sentido, monto_sugerido, medio_pago_id, es_plan, activo) VALUES
('t-plan-efectivo', 'Plan mensual – efectivo', 'ingreso', 15000, 'm-efectivo', 1, 1),
('t-plan-transf', 'Plan mensual – transferencia', 'ingreso', 15000, 'm-transf', 1, 1),
('t-bebida', 'Venta de bebida', 'ingreso', 800, 'm-efectivo', 0, 1),
('t-otros', 'Otros', 'ingreso', NULL, NULL, 0, 1);


