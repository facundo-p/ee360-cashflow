// Controlador de tipos de movimiento.
import { TiposService } from '../services/tipos.service';

export const TiposController = {
  list: async (_req: any, res: any) => {
    res.json(await TiposService.list());
  },
};


