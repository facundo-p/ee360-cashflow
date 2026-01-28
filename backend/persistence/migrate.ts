import fs from 'fs';
import path from 'path';
import { getDb } from './sqlite';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'backend', 'persistence', 'migrations');

export function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      executed_at TEXT NOT NULL
    );
  `);

  const executed = new Set(
    db.prepare('SELECT id FROM migrations').all().map((r: any) => r.id)
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (executed.has(file)) continue;

    console.log(`▶ Running migration ${file}`);

    const sql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, file),
      'utf-8'
    );

    db.exec(sql);

    db.prepare(
      'INSERT INTO migrations (id, executed_at) VALUES (?, ?)'
    ).run(file, new Date().toISOString());

    console.log(`✔ Migration ${file} applied`);
  }
}

runMigrations();
