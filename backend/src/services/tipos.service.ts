// Reglas para plantillas de tipos de movimiento.
import { TiposRepo } from '../repositories/tipos.repo';

export const TiposService = {
  list: async () => TiposRepo.list(),
};


