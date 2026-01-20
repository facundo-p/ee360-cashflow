-- 002_unique_opciones_categoria_medio.sql

CREATE UNIQUE INDEX IF NOT EXISTS
  ux_opciones_categoria_medio
ON opciones_movimiento (categoria_id, medio_pago_id);
