// Controlador de auth (placeholder).
import { AuthService } from '../services/auth.service';

export const AuthController = {
  login: async (req: any, res: any) => {
    const user = await AuthService.login(req.body.email, req.body.password);
    res.json({ user });
  },
};


