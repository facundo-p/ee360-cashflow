// Endpoints mock de medios de pago configurables.
import { mockDelay } from './client';
import { listMedios as listFromStore } from './store';

export async function listMedios() {
  await mockDelay();
  return listFromStore();
}


