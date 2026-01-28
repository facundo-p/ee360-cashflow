// DTOs de usuarios según AUTH_AND_USERS.md

export type Rol = 'admin' | 'coach';

export type UsuarioDTO = {
  id: string;
  nombre: string;
  username: string;
  rol: Rol;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

/** Para crear un usuario (sin id, timestamps, ni password_hash) */
export type UsuarioCreateDTO = {
  nombre: string;
  username: string;
  password: string;
  rol: Rol;
};

/** Para actualizar un usuario (campos opcionales, sin password) */
export type UsuarioUpdateDTO = {
  nombre?: string;
  username?: string;
  rol?: Rol;
};

/** Para cambiar password (separado del update general) */
export type UsuarioChangePasswordDTO = {
  password: string;
};

/** Interno: incluye password_hash para verificación */
export type UsuarioWithHashDTO = UsuarioDTO & {
  password_hash: string;
};
