// Acceso a persistencia de movimientos (placeholder).
import { MovimientoDTO } from '../dto/movimientos.dto';

export const MovimientosRepo = {
  list: async (): Promise<MovimientoDTO[]> => [],
  findById: async (_id: string): Promise<MovimientoDTO | null> => null,
  create: async (payload: Partial<MovimientoDTO>): Promise<MovimientoDTO> =>
    payload as MovimientoDTO,
  update: async (_id: string, payload: Partial<MovimientoDTO>): Promise<MovimientoDTO> =>
    payload as MovimientoDTO,
};


