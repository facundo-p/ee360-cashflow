// persistence/seeds/ts/010_opciones.ts
import { getDb } from '../../sqlite';
import { randomUUID } from 'crypto';
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
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'u-user',
        nombre: 'Coach Demo',
        username: 'coach@gym.test',
        password: 'coach',
        rol: 'coach',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO usuarios (
      id,
      nombre,
      username,
      password_hash,
      rol,
      activo,
      created_at,
      updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(id) DO NOTHING;
  `);

  const now = new Date().toISOString();
  for (const u of usuarios) {
    stmt.run(
      randomUUID(),
      u.nombre,
      u.username,
      await bcrypt.hash(u.password, BCRYPT_ROUNDS),
      u.rol,
      u.activo ? 1 : 0,
      now,
      now
    );
  }
}
