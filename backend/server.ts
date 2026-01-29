// Fastify server for ee360-cashflow backend
// Clean layered architecture: Routes → Controllers → Services → Repositories

import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './src/plugins/auth';
import { errorHandler } from './src/plugins/error-handler';

// Route plugins
import authRoutes from './src/routes/auth.routes';
import categoriasRoutes from './src/routes/categorias.routes';
import mediosRoutes from './src/routes/medios.routes';
import opcionesRoutes from './src/routes/opciones.routes';
import movimientosRoutes from './src/routes/movimientos.routes';
import usuariosRoutes from './src/routes/usuarios.routes';

// Configuration
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Create Fastify instance
const server = Fastify({
  logger: IS_PRODUCTION
    ? { level: process.env.LOG_LEVEL || 'info' }
    : {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
});

// Register plugins
async function registerPlugins() {
  // CORS for frontend
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Auth plugin (decorators and mock user support)
  await server.register(authPlugin);
}

// Register routes
async function registerRoutes() {
  // API routes with /api prefix
  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(categoriasRoutes, { prefix: '/api/categorias' });
  await server.register(mediosRoutes, { prefix: '/api/medios' });
  await server.register(opcionesRoutes, { prefix: '/api/opciones' });
  await server.register(movimientosRoutes, { prefix: '/api/movimientos' });
  await server.register(usuariosRoutes, { prefix: '/api/usuarios' });

  // Health check
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));
}

// Set error handler
server.setErrorHandler(errorHandler);

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await server.listen({ port: PORT, host: HOST });

    console.log('\n🚀 Backend server running!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📋 API: http://localhost:${PORT}/api`);
    console.log('\n📡 Endpoints:');
    console.log('  Auth:');
    console.log('    POST   /api/auth/login              (public)');
    console.log('    GET    /api/auth/me                 (auth)');
    console.log('  Movimientos:');
    console.log('    GET    /api/movimientos             (auth)');
    console.log('    POST   /api/movimientos             (auth)');
    console.log('    PUT    /api/movimientos/:id         (auth)');
    console.log('  Catálogos (lectura: auth, escritura: admin):');
    console.log('    GET    /api/categorias');
    console.log('    GET    /api/medios');
    console.log('    GET    /api/opciones');
    console.log('  ABM Usuarios (admin only):');
    console.log('    GET    /api/usuarios');
    console.log('    POST   /api/usuarios');
    console.log('    PUT    /api/usuarios/:id');
    console.log('    PATCH  /api/usuarios/:id/password');
    console.log('    PATCH  /api/usuarios/:id/activar');
    console.log('    PATCH  /api/usuarios/:id/desactivar');
    console.log('');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
