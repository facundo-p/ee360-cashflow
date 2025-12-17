// Controlador de usuarios (solo admin en producción).
import { UsuariosService } from '../services/usuarios.service';

export const UsuariosController = {
  list: async (_req: any, res: any) => {
    res.json(await UsuariosService.list());
  },
};


