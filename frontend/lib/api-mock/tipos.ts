// Endpoints mock de tipos de movimiento (plantillas).
import { mockDelay } from './client';
import { listTipos as listFromStore } from './store';

export async function listTipos() {
  await mockDelay();
  return listFromStore();
}


