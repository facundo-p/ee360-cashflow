import fs from 'fs';
import path from 'path';
import { getDb } from './sqlite';

// Resolve migrations dir - works both in monorepo (dev) and Docker (prod)
function getMigrationsDir(): string {
  // Try Docker/standalone path first
  const dockerPath = path.resolve(process.cwd(), 'persistence', 'migrations');
  if (fs.existsSync(dockerPath)) return dockerPath;
  
  // Fallback to monorepo path (development)
  return path.resolve(process.cwd(), 'backend', 'persistence', 'migrations');
}

const MIGRATIONS_DIR = getMigrationsDir();

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
