// Acceso a usuarios (placeholder).
import { UsuarioDTO } from '../dto/usuarios.dto';

export const UsuariosRepo = {
  list: async (): Promise<UsuarioDTO[]> => [],
  findByEmail: async (_email: string): Promise<UsuarioDTO | null> => null,
  findById: async (_id: string): Promise<UsuarioDTO | null> => null,
};


