// DTOs de usuarios.
export type UsuarioDTO = {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
};


