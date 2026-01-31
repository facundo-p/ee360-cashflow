// persistence/seed.ts
import fs from 'fs';
import path from 'path';
import { getDb } from './sqlite';
import { IS_PRODUCTION } from '../server';

// Resolve seeds dir - works both in monorepo (dev) and Docker (prod)
function getSeedsDir(subdir: string): string {
  // Try Docker/standalone path first
  const dockerPath = path.resolve(process.cwd(), 'persistence', 'seeds', subdir);
  if (fs.existsSync(dockerPath)) return dockerPath;
  
  // Fallback to monorepo path (development)
  return path.resolve(process.cwd(), 'backend', 'persistence', 'seeds', subdir);
}

async function runSqlSeeds() {
  const db = getDb();
  const dir = getSeedsDir('sql');

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`🌱 SQL seed: ${file}`);
    const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
    db.exec(sql);
  }
}

async function runTsSeeds() {
  // In production (Docker), TS seeds are compiled to JS in dist/
  const isProd = IS_PRODUCTION;
  const ext = isProd ? '.js' : '.ts';
  
  let dir: string;
  if (isProd) {
    dir = path.resolve(process.cwd(), 'dist', 'persistence', 'seeds', 'ts');
  } else {
    dir = getSeedsDir('ts');
  }

  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort();

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