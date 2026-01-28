-- 003_ajustes_usuarios.sql
-- Ajusta la tabla usuarios según AUTH_AND_USERS.md:
--   - Renombra email → username
--   - Cambia rol 'usuario' → 'coach'
--   - Cambia estado (TEXT) → activo (INTEGER)

PRAGMA foreign_keys = OFF;

-- 1. Crear tabla temporal con nueva estructura
CREATE TABLE usuarios_new (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin','coach')),
  activo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Migrar datos (convirtiendo valores)
INSERT INTO usuarios_new (id, nombre, username, password_hash, rol, activo, created_at, updated_at)
SELECT 
  id,
  nombre,
  email AS username,
  password_hash,
  CASE WHEN rol = 'usuario' THEN 'coach' ELSE rol END AS rol,
  CASE WHEN estado = 'activo' THEN 1 ELSE 0 END AS activo,
  created_at,
  updated_at
FROM usuarios;

-- 3. Eliminar tabla original
DROP TABLE usuarios;

-- 4. Renombrar tabla temporal
ALTER TABLE usuarios_new RENAME TO usuarios;

-- 5. Recrear índice de rol
DROP INDEX IF EXISTS idx_usuarios_rol;
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- 6. Agregar índice para filtrar por activo
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- 7. Agregar índice para búsqueda por username
CREATE INDEX idx_usuarios_username ON usuarios(username);

PRAGMA foreign_keys = ON;
