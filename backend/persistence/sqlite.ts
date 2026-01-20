// persistence/sqlite.ts
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

/**
 * Devuelve una conexión singleton a SQLite.
 * Se inicializa lazy (la primera vez que se llama).
 */
export function getDb(): Database.Database {
  if (!db) {
    const dbPath =
      process.env.DATABASE_PATH ??
      path.resolve(process.cwd(), 'data', 'app.sqlite');

    db = new Database(dbPath);

    // Recomendado para integridad referencial
    db.pragma('foreign_keys = ON');

    // Opcional: mejora concurrencia
    db.pragma('journal_mode = WAL');
  }

  return db;
}
