# Arquitectura (capas desacopladas)

## Frontend
- Next/React PWA, mobile-first.
- Mock UI con `lib/api-mock` y seeds en `__mocks__`.
- Pantallas: login, botonera, formulario, listado, edición, admin (tipos, medios, usuarios).
- Reglas UX: sin scroll crítico, CTA siempre visible, foco según monto sugerido, toasts rápidos.

## Backend
- Capas: controllers → services → repositories.
- DTOs en `src/dto` separan API de persistencia.
- Auth JWT (placeholder), middlewares de rol.
- Reglas: usuario edita propios ≤24h (lógica a implementar), admin sin límite; auditoría en updates.

## Persistencia
- SQLite inicial (`persistence/schema.sql`), migrable a Postgres.
- Tablas: usuarios, medios_pago, tipos_movimiento, movimientos, auditoria_movimientos.
- Seeds iniciales para medios, tipos y admin demo.

## Configuración
- Variables de entorno: ver `config/env.example` (sin secretos reales).
- Lint/Prettier en `config/`.

## Flujo de datos
- Front (mock) → API mock o backend real (cambiando baseURL/env).
- Backend aplica servicios y repos → SQLite adapter (hoy) o Postgres (mañana).


