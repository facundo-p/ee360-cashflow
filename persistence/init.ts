// persistence/init.ts
import { getDb } from './sqlite';
import { runMigrations } from './migrate';
import { runSeeds } from './seed';

async function initDatabase() {
  console.log('🚀 Initializing database...');

  try {
    // 1️⃣ Create / open DB (side-effect: ensures file exists)
    const db = getDb();
    db.exec('SELECT 1');  // Check if the database is connected and ready to use
    console.log('📦 Database connection established');

    // 2️⃣ Run migrations (schema)
    runMigrations();
    console.log('🧱 Migrations completed');

    // 3️⃣ Run seeds (initial data)
    await runSeeds();
    console.log('🌱 Seeds completed');

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed');
    console.error(error);
    process.exit(1);
  }
}

initDatabase();
