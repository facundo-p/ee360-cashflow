// Configuración centralizada de autenticación
// Según AUTH_AND_USERS.md sección 1.1

/** Duración del JWT en segundos (8 horas) */
export const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 8;

/** Secret para firmar JWT - En producción usar variable de entorno */
export const JWT_SECRET = process.env.JWT_SECRET || 'ee360-dev-secret-change-in-production';
