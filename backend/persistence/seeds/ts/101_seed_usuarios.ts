// persistence/seeds/ts/101_seed_usuarios.ts
// Seeds demo users for development/testing
import { getDb } from '../../sqlite';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

export async function run() {
  const db = getDb();

  const usuarios = [
    {
      id: 'u-admin',
      nombre: 'Admin Demo',
      username: 'admin@gym.test',
      password: 'admin',
      rol: 'admin',
    },
    {
      id: 'u-coach',
      nombre: 'Coach Demo',
      username: 'coach@gym.test',
      password: 'coach',
      rol: 'coach',
    },
  ];

  const stmt = db.prepare(`
    INSERT INTO usuarios (
      id,
      nombre,
      username,
      password_hash,
      rol,
      activo,
      created_at,
      updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now')
    )
    ON CONFLICT(id) DO NOTHING
  `);

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.password, BCRYPT_ROUNDS);
    stmt.run(u.id, u.nombre, u.username, hash, u.rol);
  }

  console.log(`  ✓ Created ${usuarios.length} demo users`);
}
