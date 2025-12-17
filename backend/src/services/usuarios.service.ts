// Reglas para usuarios (admin gestiona).
import { UsuariosRepo } from '../repositories/usuarios.repo';

export const UsuariosService = {
  list: async () => UsuariosRepo.list(),
};


