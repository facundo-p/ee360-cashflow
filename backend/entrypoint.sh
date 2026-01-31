#!/bin/sh
set -e

DB_FILE="${DB_PATH:-/data/app.sqlite}"

if [ ! -f "$DB_FILE" ]; then
  echo "📦 Database not found. Initializing..."
  node dist/persistence/migrate.js
  node dist/persistence/seed.js
else
  echo "✅ Database already exists. Skipping init."
fi

echo "🚀 Starting server..."
exec node dist/server.js