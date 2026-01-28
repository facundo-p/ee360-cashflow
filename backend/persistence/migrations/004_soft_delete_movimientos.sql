-- 004_soft_delete_movimientos.sql
-- Agrega soporte para soft delete de movimientos
-- Permite mantener historial de auditoría y recuperar movimientos si es necesario

-- Agregar campos para soft delete
ALTER TABLE movimientos ADD COLUMN deleted_at TEXT NULL;
ALTER TABLE movimientos ADD COLUMN deleted_by_user_id TEXT NULL REFERENCES usuarios(id);

-- Índice para filtrar movimientos no eliminados eficientemente
CREATE INDEX IF NOT EXISTS idx_movimientos_deleted_at ON movimientos(deleted_at);

-- Índice compuesto para consultas comunes (fecha + no eliminados)
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha_activos ON movimientos(fecha DESC, created_at DESC) WHERE deleted_at IS NULL;
