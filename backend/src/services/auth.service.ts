// Lógica de autenticación (placeholder).
import { UsuariosRepo } from '../repositories/usuarios.repo';

export const AuthService = {
  login: async (email: string, _password: string) => {
    return UsuariosRepo.findByEmail(email);
  },
};


