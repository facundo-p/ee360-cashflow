// Auth mock: devuelve usuario seed según email/rol predefinido.
import { mockDelay } from './client';
import { findUsuarioByEmail } from './store';

export async function loginMock(email: string) {
  await mockDelay();
  return findUsuarioByEmail(email) ?? null;
}


