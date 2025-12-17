// Controlador de medios de pago configurables.
import { MediosService } from '../services/medios.service';

export const MediosController = {
  list: async (_req: any, res: any) => {
    res.json(await MediosService.list());
  },
};


