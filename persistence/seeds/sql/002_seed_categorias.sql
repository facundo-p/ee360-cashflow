INSERT OR IGNORE INTO categorias_movimiento (id, nombre, sentido, es_plan, activo) VALUES
('cat_clase_suelta', 'Clase suelta', 'ingreso', 1, 1),
('cat_plan_mensual', 'Plan mensual', 'ingreso', 1, 1),
('cat_plan_semestral', 'Plan semestral', 'ingreso', 1, 1),
('cat_bebida', 'Venta de bebida', 'ingreso', 0, 1),
('cat_merch', 'Venta merch', 'ingreso', 0, 1),
('cat_clase_kids', 'Clase kids', 'ingreso', 1, 1),
('cat_plan_kids_1x_semana', 'Plan kids 1x semana', 'ingreso', 1, 1),
('cat_plan_kids_2x_semana', 'Plan kids 2x semana', 'ingreso', 1, 1),
('cat_otros_ingreso', 'Otros - Ingresos', 'ingreso', 0, 1),
('cat_otros_egreso', 'Otros - Egresos', 'egreso', 0, 1)
ON CONFLICT(id) DO NOTHING;
