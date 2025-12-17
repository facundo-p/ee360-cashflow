// Endpoints mock de usuarios (admin/usuario) para gestión básica.
import { mockDelay } from './client';
import { listUsuarios as listFromStore, findUsuarioByEmail } from './store';

export async function listUsuarios() {
  await mockDelay();
  return listFromStore();
}

export async function findByEmail(email: string) {
  await mockDelay();
  return findUsuarioByEmail(email);
}


