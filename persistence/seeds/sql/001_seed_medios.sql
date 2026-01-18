INSERT OR IGNORE INTO medios_pago (id, nombre, activo, orden) VALUES
('m_efectivo', 'Efectivo', 1, 1),
('m_transferencia', 'Transferencia', 1, 2),
('m_mercado_pago', 'Mercado Pago', 1, 3),
('m_debito', 'Debito', 1, 4),
('m_credito', 'Credito', 1, 5)
ON CONFLICT(id) DO NOTHING;;


