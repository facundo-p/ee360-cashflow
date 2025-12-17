-- Esquema base (compatible con SQLite, pensado para migrar a Postgres).
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin','usuario')),
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','inactivo')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medios_pago (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  activo INTEGER NOT NULL DEFAULT 1,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipos_movimiento (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  sentido TEXT NOT NULL CHECK (sentido IN ('ingreso','egreso')),
  monto_sugerido NUMERIC,
  medio_pago_id TEXT REFERENCES medios_pago(id),
  es_plan INTEGER NOT NULL DEFAULT 0,
  activo INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL DEFAULT (DATE('now')),
  tipo_movimiento_id TEXT NOT NULL REFERENCES tipos_movimiento(id),
  sentido TEXT NOT NULL CHECK (sentido IN ('ingreso','egreso')),
  monto NUMERIC NOT NULL CHECK (monto > 0),
  medio_pago_id TEXT NOT NULL REFERENCES medios_pago(id),
  nombre_cliente TEXT,
  nota TEXT,
  usuario_creador_id TEXT NOT NULL REFERENCES usuarios(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auditoria_movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movimiento_id TEXT NOT NULL REFERENCES movimientos(id),
  usuario_id TEXT NOT NULL REFERENCES usuarios(id),
  campo TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  cambiado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices sugeridos
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos(fecha);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos(tipo_movimiento_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_usuario ON movimientos(usuario_creador_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_medio ON movimientos(medio_pago_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_sentido ON movimientos(sentido);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha_desc ON movimientos(fecha DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tipos_activo ON tipos_movimiento(activo);
CREATE INDEX IF NOT EXISTS idx_tipos_medio ON tipos_movimiento(medio_pago_id);
CREATE INDEX IF NOT EXISTS idx_medios_activo_orden ON medios_pago(activo, orden);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_aud_movimiento ON auditoria_movimientos(movimiento_id);
CREATE INDEX IF NOT EXISTS idx_aud_usuario ON auditoria_movimientos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_aud_fecha ON auditoria_movimientos(cambiado_en DESC);


