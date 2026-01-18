INSERT OR IGNORE INTO usuarios (id, nombre, email, password_hash, rol, estado) VALUES
('u_admin_demo', 'Admin Demo', 'admin@gym.test', 'hash-placeholder', 'admin', 'activo'),
('u_user_demo', 'Coach Demo', 'coach@gym.test', 'hash-placeholder', 'usuario', 'activo')
ON CONFLICT(id) DO NOTHING;;


