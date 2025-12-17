# EE360 Cashflow – Scaffold MVP

Este proyecto incluye:
- Frontend mock (mobile-first) para validar UX rápida.
- Backend esqueleto con capas (controllers/services/repos).
- Persistencia inicial SQLite lista para migrar a Postgres.

## Cómo probar
- Frontend mock: conecta contra `lib/api-mock` y seeds en `frontend/__mocks__`.
- Backend: server placeholder en `backend/server.ts`.
- Config: variables de entorno de ejemplo en `config/env.example`.

## Scripts esperados
- `frontend:dev` – levanta Next/React.
- `backend:dev` – levanta el server mock.
- `db:migrate` – aplica `persistence/migrations`.
- `db:seed` – ejecuta seeds iniciales.
- `lint` / `format` – chequeo y formato.


