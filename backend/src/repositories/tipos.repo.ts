// Acceso a tipos de movimiento (placeholder).
import { TipoMovimientoDTO } from '../dto/tipos.dto';

export const TiposRepo = {
  list: async (): Promise<TipoMovimientoDTO[]> => [],
  findById: async (_id: string): Promise<TipoMovimientoDTO | null> => null,
};


