// Middlewares de auth/roles (placeholder).
export function requireAuth(req: unknown, res: unknown, next: () => void) {
  // Validar JWT en implementación real.
  next();
}

export function requireRole(role: 'admin' | 'usuario') {
  return function roleMiddleware(req: unknown, res: unknown, next: () => void) {
    // Validar rol en implementación real.
    next();
  };
}


