// Repositorio de usuarios con SQLite según AUTH_AND_USERS.md
import { getDb } from '../../persistence/sqlite';
import {
  UsuarioDTO,
  UsuarioCreateDTO,
  UsuarioUpdateDTO,
  UsuarioWithHashDTO,
} from '../dto/usuarios.dto';
import { IdFactory } from '../utils/idFactory';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

/** Convierte row de SQLite a DTO (activo: 0/1 → boolean) */
function rowToDTO(row: any): UsuarioDTO {
  if (!row) return row;
  return {
    id: row.id,
    nombre: row.nombre,
    username: row.username,
    rol: row.rol,
    activo: Boolean(row.activo),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Convierte row a DTO con hash incluido */
function rowToWithHash(row: any): UsuarioWithHashDTO | null {
  if (!row) return null;
  return {
    ...rowToDTO(row),
    password_hash: row.password_hash,
  };
}

export const UsuariosRepo = {
  /**
   * Lista todos los usuarios.
   * @param soloActivos - Si true, filtra solo usuarios activos
   */
  async list(soloActivos = false): Promise<UsuarioDTO[]> {
    const db = getDb();

    const sql = `
      SELECT id, nombre, username, rol, activo, created_at, updated_at
      FROM usuarios
      ${soloActivos ? 'WHERE activo = 1' : ''}
      ORDER BY nombre ASC
    `;

    const rows = db.prepare(sql).all();
    return rows.map(rowToDTO);
  },

  /**
   * Busca un usuario por ID.
   */
  async findById(id: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT id, nombre, username, rol, activo, created_at, updated_at
        FROM usuarios
        WHERE id = ?
      `
      )
      .get(id);

    return row ? rowToDTO(row) : null;
  },

  /**
   * Busca un usuario por username (case insensitive).
   */
  async findByUsername(username: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT id, nombre, username, rol, activo, created_at, updated_at
        FROM usuarios
        WHERE lower(username) = lower(?)
      `
      )
      .get(username);

    return row ? rowToDTO(row) : null;
  },

  /**
   * Busca usuario por username incluyendo password_hash (para auth).
   */
  async findByUsernameWithHash(username: string): Promise<UsuarioWithHashDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT id, nombre, username, rol, activo, created_at, updated_at, password_hash
        FROM usuarios
        WHERE lower(username) = lower(?)
      `
      )
      .get(username);

    return rowToWithHash(row);
  },

  /**
   * Crea un nuevo usuario.
   * @returns El usuario creado (sin password_hash)
   */
  async create(payload: UsuarioCreateDTO): Promise<UsuarioDTO> {
    const db = getDb();

    const id = IdFactory.usuario();
    const password_hash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);

    db.prepare(
      `
      INSERT INTO usuarios (id, nombre, username, password_hash, rol, activo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `
    ).run(id, payload.nombre, payload.username, password_hash, payload.rol);

    return this.findById(id) as Promise<UsuarioDTO>;
  },

  /**
   * Actualiza un usuario existente (sin cambiar password).
   */
  async update(id: string, payload: UsuarioUpdateDTO): Promise<UsuarioDTO | null> {
    const db = getDb();

    const fields: string[] = [];
    const values: any[] = [];

    if (payload.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(payload.nombre);
    }

    if (payload.username !== undefined) {
      fields.push('username = ?');
      values.push(payload.username);
    }

    if (payload.rol !== undefined) {
      fields.push('rol = ?');
      values.push(payload.rol);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push("updated_at = datetime('now')");

    const result = db
      .prepare(
        `
      UPDATE usuarios
      SET ${fields.join(', ')}
      WHERE id = ?
    `
      )
      .run(...values, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Cambia el password de un usuario.
   */
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    const db = getDb();

    const password_hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    const result = db
      .prepare(
        `
      UPDATE usuarios
      SET password_hash = ?, updated_at = datetime('now')
      WHERE id = ?
    `
      )
      .run(password_hash, id);

    return result.changes > 0;
  },

  /**
   * Activa un usuario.
   */
  async activar(id: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const result = db
      .prepare(
        `
      UPDATE usuarios
      SET activo = 1, updated_at = datetime('now')
      WHERE id = ?
    `
      )
      .run(id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Desactiva un usuario.
   */
  async desactivar(id: string): Promise<UsuarioDTO | null> {
    const db = getDb();

    const result = db
      .prepare(
        `
      UPDATE usuarios
      SET activo = 0, updated_at = datetime('now')
      WHERE id = ?
    `
      )
      .run(id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Verifica si un username ya está en uso (para validación).
   * @param username - Username a verificar
   * @param excludeId - ID de usuario a excluir (para updates)
   */
  async usernameExists(username: string, excludeId?: string): Promise<boolean> {
    const db = getDb();

    const sql = excludeId
      ? `SELECT 1 FROM usuarios WHERE lower(username) = lower(?) AND id != ? LIMIT 1`
      : `SELECT 1 FROM usuarios WHERE lower(username) = lower(?) LIMIT 1`;

    const params = excludeId ? [username, excludeId] : [username];
    const row = db.prepare(sql).get(...params);

    return Boolean(row);
  },

  /**
   * Obtiene el password hash de un usuario (para verificación interna).
   */
  async getPasswordHash(userId: string): Promise<string | null> {
    const db = getDb();

    const row = db
      .prepare(`SELECT password_hash FROM usuarios WHERE id = ?`)
      .get(userId) as { password_hash: string } | undefined;

    return row?.password_hash ?? null;
  },
};
