// Helpers JWT (placeholder). Sustituir por implementación real.
export function signToken(payload: unknown): string {
  return JSON.stringify(payload);
}

export function verifyToken<T>(token: string): T | null {
  try {
    return JSON.parse(token) as T;
  } catch {
    return null;
  }
}


