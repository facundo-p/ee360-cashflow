// Reglas para medios de pago configurables.
import { MediosRepo } from '../repositories/medios.repo';

export const MediosService = {
  list: async () => MediosRepo.list(),
};


