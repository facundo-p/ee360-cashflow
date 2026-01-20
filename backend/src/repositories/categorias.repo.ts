// src/repositories/categorias.repo.ts

import { getDb } from '../../persistence/sqlite';
import {
  CategoriaDTO,
  CategoriaCreateDTO,
  CategoriaUpdateDTO
} from '../dto/categorias.dto';
import { IdFactory } from '../utils/idFactory';

export const CategoriasRepo = {
  /**
   * Lista todas las categorías.
   */
  async list(soloActivas = false): Promise<CategoriaDTO[]> {
    const db = getDb();

    const sql = `
      SELECT
        id,
        nombre,
        sentido,
        es_plan,
        activo,
        created_at,
        updated_at
      FROM categorias_movimiento
      ${soloActivas ? 'WHERE activo = 1' : ''}
      ORDER BY nombre ASC
    `;

    const rows = db.prepare(sql).all() as CategoriaDTO[];

    return rows.map(row => ({
      ...row,
      es_plan: Boolean(row.es_plan),
      activo: Boolean(row.activo),
    }));
  },

  /**
   * Busca una categoría por ID.
   */
  async findById(id: string): Promise<CategoriaDTO | null> {
    const db = getDb();

    const row = db.prepare(`
      SELECT *
      FROM categorias_movimiento
      WHERE id = ?
    `).get(id) as CategoriaDTO | undefined;

    if (!row) return null;

    return {
      ...row,
      es_plan: Boolean(row.es_plan),
      activo: Boolean(row.activo),
    };
  },

  /**
   * Busca una categoría por nombre (case insensitive).
   */
  async findByNombre(nombre: string): Promise<CategoriaDTO | null> {
    const db = getDb();

    const row = db.prepare(`
      SELECT *
      FROM categorias_movimiento
      WHERE lower(nombre) = lower(?)
      LIMIT 1
    `).get(nombre) as CategoriaDTO | undefined;

    if (!row) return null;

    return {
      ...row,
      es_plan: Boolean(row.es_plan),
      activo: Boolean(row.activo),
    };
  },

  /**
   * Crea una nueva categoría.
   */
  async create(payload: CategoriaCreateDTO): Promise<CategoriaDTO> {
    const db = getDb();

    const id = IdFactory.categoria(payload.nombre);

    db.prepare(`
      INSERT INTO categorias_movimiento (
        id,
        nombre,
        sentido,
        es_plan,
        activo
      ) VALUES (?, ?, ?, ?, 1)
    `).run(
      id,
      payload.nombre,
      payload.sentido,
      payload.es_plan ? 1 : 0
    );

    return this.findById(id) as Promise<CategoriaDTO>;
  },

  /**
   * Actualiza una categoría existente.
   */
  async update(id: string, payload: CategoriaUpdateDTO): Promise<CategoriaDTO | null> {
    const db = getDb();

    const fields: string[] = [];
    const values: any[] = [];
    console.log("Payload: ", payload);
    if (payload.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(payload.nombre);
    }

    if (payload.sentido !== undefined) {
      fields.push('sentido = ?');
      values.push(payload.sentido);
    }

    if (payload.es_plan !== undefined) {
      fields.push('es_plan = ?');
      values.push(payload.es_plan ? 1 : 0);
    }

    if (payload.activo !== undefined) {
      fields.push('activo = ?');
      values.push(payload.activo ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    // mantenemos updated_at consistente con la tabla
    fields.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `
      UPDATE categorias_movimiento
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    const result = db.prepare(sql).run(...values, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Verifica si hay opciones activas que usan esta categoría.
   */
  async tieneOpcionesActivas(categoriaId: string): Promise<boolean> {
    const db = getDb();

    const row = db.prepare(`
      SELECT 1
      FROM opciones_movimiento
      WHERE categoria_id = ?
        AND activo = 1
      LIMIT 1
    `).get(categoriaId);

    return Boolean(row);
  },
};
