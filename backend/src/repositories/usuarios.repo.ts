// Repositorio de usuarios con SQLite
import { getDb } from '../../persistence/sqlite';
import { UsuarioDTO } from '../dto/usuarios.dto';

type UsuarioRow = UsuarioDTO & { password_hash: string };

export const UsuariosRepo = {
  /**
   * Lista todos los usuarios.
   */
  async list(): Promise<UsuarioDTO[]> {
    const db = getDb();

    const rows = db
      .prepare(
        `
        SELECT id, nombre, email, rol, estado
        FROM usuarios
        ORDER BY nombre ASC
      `
      )
      .all() as UsuarioDTO[];

    return rows;
  },

  /**
   * Busca un usuario por ID.
   */
  async findById(id: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT id, nombre, email, rol, estado
        FROM usuarios
        WHERE id = ?
      `
      )
      .get(id) as UsuarioDTO | undefined;

    return row ?? null;
  },

  /**
   * Busca un usuario por email.
   */
  async findByEmail(email: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT id, nombre, email, rol, estado
        FROM usuarios
        WHERE lower(email) = lower(?)
      `
      )
      .get(email) as UsuarioDTO | undefined;

    return row ?? null;
  },

  /**
   * Verifica credenciales de usuario.
   * Retorna el usuario si las credenciales son válidas.
   */
  async verifyCredentials(
    email: string,
    password: string
  ): Promise<UsuarioDTO | null> {
    const db = getDb();

    // Buscar usuario con password_hash
    const row = db
      .prepare(
        `
        SELECT id, nombre, email, rol, estado, password_hash
        FROM usuarios
        WHERE lower(email) = lower(?)
      `
      )
      .get(email) as UsuarioRow | undefined;

    if (!row || row.estado !== 'activo') {
      return null;
    }

    // TODO: Implementar verificación real de password con bcrypt
    // Por ahora, cualquier password es válido para desarrollo
    // En producción: const valid = await bcrypt.compare(password, row.password_hash);
    
    // Retornar usuario sin password_hash
    const { password_hash, ...user } = row;
    return user;
  },

  /**
   * Obtiene el password hash de un usuario (para verificación).
   */
  async getPasswordHash(userId: string): Promise<string | null> {
    const db = getDb();

    const row = db
      .prepare(`SELECT password_hash FROM usuarios WHERE id = ?`)
      .get(userId) as { password_hash: string } | undefined;

    return row?.password_hash ?? null;
  },
};
