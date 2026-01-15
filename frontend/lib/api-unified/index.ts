// Unified API Module
// Automatically switches between mock and real API based on configuration
// 
// Usage: import { listTipos, createMovimiento } from '@/lib/api-unified';
//
// To use mock API: set NEXT_PUBLIC_USE_MOCK_API=true in .env.local
// To use real API: unset or set to false

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Re-export everything from the appropriate source
export * from './tipos';
export * from './movimientos';
export * from './categorias';
export * from './medios';
export * from './opciones';
export * from './auth';

// Export the configuration flag
export { USE_MOCK_API as isUsingMockApi };
