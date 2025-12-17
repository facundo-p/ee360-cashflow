// Controlador de movimientos.
import { MovimientosService } from '../services/movimientos.service';

export const MovimientosController = {
  list: async (_req: any, res: any) => {
    res.json(await MovimientosService.list());
  },
  create: async (req: any, res: any) => {
    res.json(await MovimientosService.create(req.body));
  },
  update: async (req: any, res: any) => {
    res.json(await MovimientosService.update(req.params.id, req.body, req.user?.id));
  },
  get: async (req: any, res: any) => {
    res.json(await MovimientosService.get(req.params.id));
  },
};


