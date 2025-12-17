// Endpoints mock de movimientos: lista, crea, edita en memoria.
import { mockDelay } from './client';
import {
  listMovimientos as listFromStore,
  createMovimiento as createInStore,
  updateMovimiento as updateInStore,
  findMovimiento,
} from './store';

export async function listMovimientos() {
  await mockDelay();
  return listFromStore();
}

export async function getMovimiento(id: string) {
  await mockDelay();
  return findMovimiento(id);
}

export async function createMovimiento(payload: any) {
  await mockDelay();
  return createInStore(payload);
}

export async function updateMovimiento(id: string, payload: any) {
  await mockDelay();
  return updateInStore(id, payload);
}


