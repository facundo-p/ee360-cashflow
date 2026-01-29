// persistence/sqlite.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

/**
 * Devuelve una conexión singleton a SQLite.
 * Se inicializa lazy (la primera vez que se llama).
 * Uses DB_PATH env var, falls back to ./data/app.sqlite
 */
export function getDb(): Database.Database {
  if (!db) {
    const dbPath =
      process.env.DB_PATH ??
      process.env.DATABASE_PATH ??
      path.resolve(process.cwd(), 'data', 'app.sqlite');

    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);

    // Recomendado para integridad referencial
    db.pragma('foreign_keys = ON');

    // Opcional: mejora concurrencia
    db.pragma('journal_mode = WAL');
  }

  return db;
}
