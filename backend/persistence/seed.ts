// persistence/seeds/seed.ts
import fs from 'fs';
import path from 'path';
import { getDb } from './sqlite';

async function runSqlSeeds() {
  const db = getDb();
  const dir = path.resolve(process.cwd(), 'backend', 'persistence', 'seeds', 'sql');

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`🌱 SQL seed: ${file}`);
    const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
    db.exec(sql);
  }
}

async function runTsSeeds() {
  const dir = path.resolve(process.cwd(), 'backend', 'persistence', 'seeds', 'ts');

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts')).sort();

  for (const file of files) {
    console.log(`🌱 TS seed: ${file}`);
    const modulePath = path.join(dir, file);
    const seedModule = await import(modulePath);

    if (typeof seedModule.run !== 'function') {
      throw new Error(`Seed ${file} does not export a run() function`);
    }

    await seedModule.run();
  }
}

export async function runSeeds() {
  console.log('🌱 Running seeds...');
  await runSqlSeeds();
  await runTsSeeds();
  console.log('✅ Seeds completed');
}

runSeeds();