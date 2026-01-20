import { getDb } from '../../persistence/sqlite';
import { CategoriaDTO } from '../dto/categorias.dto';
import {
  OpcionMovimientoDTO,
  OpcionMovimientoEnriquecidaDTO,
  OpcionCreateDTO,
  OpcionUpdateDTO,
} from '../dto/opciones.dto';
import { IdFactory } from '../utils/idFactory';

type OpcionRow = OpcionMovimientoDTO;

function reordenarOpciones(
  db: any,
  opcionId: string,
  ordenNuevo: number
) {
  // 1. Obtener orden actual
  const row = db
    .prepare(`SELECT orden FROM opciones_movimiento WHERE id = ?`)
    .get(opcionId) as { orden: number } | undefined;

  if (!row) {
    throw new Error('Opción no encontrada');
  }

  const ordenActual = row.orden;

  // 2. Si no cambia, no hacer nada
  if (ordenActual === ordenNuevo) return;

  // 3. Reordenar las demás
  if (ordenNuevo < ordenActual) {
    // SUBE (ej: 5 → 2)
    db.prepare(`
      UPDATE opciones_movimiento
      SET orden = orden + 1
      WHERE orden >= ?
        AND orden < ?
    `).run(ordenNuevo, ordenActual);
  } else {
    // BAJA (ej: 2 → 5)
    db.prepare(`
      UPDATE opciones_movimiento
      SET orden = orden - 1
      WHERE orden > ?
        AND orden <= ?
    `).run(ordenActual, ordenNuevo);
  }

  // 4. Asignar nuevo orden a la opción
  db.prepare(`
    UPDATE opciones_movimiento
    SET orden = ?
    WHERE id = ?
  `).run(ordenNuevo, opcionId);
}


export const OpcionesRepo = {
  /**
   * Lista todas las opciones.
   */
  async list(soloActivas = false): Promise<OpcionMovimientoDTO[]> {
    const db = getDb();

    const rows = db
      .prepare(
        `
        SELECT *
        FROM opciones_movimiento
        ${soloActivas ? 'WHERE activo = 1' : ''}
        ORDER BY orden ASC
      `
      )
      .all() as OpcionRow[];

    return rows.map(r => ({
      ...r,
      activo: Boolean(r.activo),
    }));
  },

  /**
   * Lista opciones con datos enriquecidos.
   */
  async listEnriquecidas(
    soloActivas = false
  ): Promise<OpcionMovimientoEnriquecidaDTO[]> {
    const db = getDb();

    const rows = db
      .prepare(
        `
        SELECT
          o.*,
          c.nombre  AS categoria_nombre,
          c.sentido AS categoria_sentido,
          m.nombre  AS medio_pago_nombre
        FROM opciones_movimiento o
        JOIN categorias_movimiento c ON c.id = o.categoria_id
        JOIN medios_pago m ON m.id = o.medio_pago_id
        ${soloActivas ? 'WHERE o.activo = 1' : ''}
        ORDER BY o.orden ASC
      `
      )
      .all() as Array<
      OpcionRow & {
        categoria_nombre: string;
        categoria_sentido: 'ingreso' | 'egreso';
        medio_pago_nombre: string;
      }
    >;

    return rows.map(r => ({
      ...r,
      activo: Boolean(r.activo),
    }));
  },

  /**
   * Busca una opción por ID.
   */
  async findById(id: string): Promise<OpcionMovimientoDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT *
        FROM opciones_movimiento
        WHERE id = ?
      `
      )
      .get(id) as OpcionRow | undefined;

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Busca una categoría por nombre (case insensitive).
   */
  async findByNombre(nombre: string): Promise<OpcionMovimientoDTO | null> {
    const db = getDb();

    const row = db.prepare(`
      SELECT *
      FROM opciones_movimiento
      WHERE lower(nombre_display) = lower(?)
      LIMIT 1
    `).get(nombre) as OpcionRow | undefined;

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Busca una opción por ID con datos enriquecidos.
   */
  async findByIdEnriquecida(
    id: string
  ): Promise<OpcionMovimientoEnriquecidaDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT
          o.*,
          c.nombre  AS categoria_nombre,
          c.sentido AS categoria_sentido,
          m.nombre  AS medio_pago_nombre
        FROM opciones_movimiento o
        JOIN categorias_movimiento c ON c.id = o.categoria_id
        JOIN medios_pago m ON m.id = o.medio_pago_id
        WHERE o.id = ?
      `
      )
      .get(id) as
      | (OpcionRow & {
          categoria_nombre: string;
          categoria_sentido: 'ingreso' | 'egreso';
          medio_pago_nombre: string;
        })
      | undefined;

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Busca por combinación categoría + medio.
   */
  async findByCategoriaMedio(
    categoriaId: string,
    medioId: string
  ): Promise<OpcionMovimientoDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT *
        FROM opciones_movimiento
        WHERE categoria_id = ?
          AND medio_pago_id = ?
      `
      )
      .get(categoriaId, medioId) as OpcionRow | undefined;

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Crea una nueva opción.
   */
  async create(payload: OpcionCreateDTO): Promise<OpcionMovimientoDTO> {
    const db = getDb();

    const maxOrdenRow = db
      .prepare(`SELECT MAX(orden) as max FROM opciones_movimiento`)
      .get() as { max: number | null };

    const orden = payload.orden ?? (maxOrdenRow.max ?? 0) + 1;
    const id = IdFactory.opcion();
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO opciones_movimiento (
        id,
        categoria_id,
        medio_pago_id,
        nombre_display,
        icono,
        monto_sugerido,
        activo,
        orden,
        fecha_actualizacion_precio,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `
    ).run(
      id,
      payload.categoria_id,
      payload.medio_pago_id,
      payload.nombre_display,
      payload.icono ?? 'default.png',
      payload.monto_sugerido ?? null,
      orden,
      payload.monto_sugerido ? now : null,
      now
    );

    return this.findById(id)!;
  },

  /**
   * Actualiza una opción existente.
   */
  async update(
    id: string,
    payload: OpcionUpdateDTO
  ): Promise<OpcionMovimientoDTO | null> {
    const db = getDb();

    const tx = db.transaction(() => {
      try {
        const fields: string[] = [];
        const values: any[] = [];

        // Reordenar si viene orden nuevo
        if (payload.orden !== undefined) {
          reordenarOpciones(db, id, payload.orden);
        }


        if (payload.nombre_display !== undefined) {
          fields.push('nombre_display = ?');
          values.push(payload.nombre_display);
        }

        if (payload.icono !== undefined) {
          fields.push('icono = ?');
          values.push(payload.icono);
        }

        if (payload.monto_sugerido !== undefined) {
          fields.push('monto_sugerido = ?');
          values.push(payload.monto_sugerido);
          fields.push('fecha_actualizacion_precio = CURRENT_TIMESTAMP');
        }

        if (payload.activo !== undefined) {
          fields.push('activo = ?');
          values.push(payload.activo ? 1 : 0);
        }

        if (payload.orden !== undefined) {
          fields.push('orden = ?');
          values.push(payload.orden);
        }

        if (fields.length !== 0) {

          fields.push('updated_at = CURRENT_TIMESTAMP');

          const result = db
            .prepare(
              `
              UPDATE opciones_movimiento
              SET ${fields.join(', ')}
              WHERE id = ?
            `
            )
            .run(...values, id);
        }
      } catch (e) {
        throw e;
      }
    });

    tx();

    return this.findById(id);
  },

  /**
   * Actualiza el precio de múltiples opciones.
   */
  async updatePrecios(
    updates: Array<{ id: string; monto_sugerido: number }>
  ): Promise<number> {
    const db = getDb();
    let count = 0;

    const stmt = db.prepare(`
      UPDATE opciones_movimiento
      SET monto_sugerido = ?,
          fecha_actualizacion_precio = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    for (const u of updates) {
      const res = stmt.run(u.monto_sugerido, u.id);
      if (res.changes > 0) count++;
    }

    return count;
  },

  /**
   * Verifica si existen movimientos que usen esta opción.
   */
  async tieneMovimientos(opcionId: string): Promise<boolean> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT 1
        FROM movimientos
        WHERE opcion_id = ?
        LIMIT 1
      `
      )
      .get(opcionId);

    return Boolean(row);
  },

  /**
   * Cuenta opciones activas que usan una categoría.
   */
  async countByCategoria(
    categoriaId: string,
    soloActivas = true
  ): Promise<number> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT COUNT(*) as count
        FROM opciones_movimiento
        WHERE categoria_id = ?
        ${soloActivas ? 'AND activo = 1' : ''}
      `
      )
      .get(categoriaId) as { count: number };

    return row.count;
  },

  /**
   * Cuenta opciones activas que usan un medio de pago.
   */
  async countByMedio(
    medioId: string,
    soloActivas = true
  ): Promise<number> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT COUNT(*) as count
        FROM opciones_movimiento
        WHERE medio_pago_id = ?
        ${soloActivas ? 'AND activo = 1' : ''}
      `
      )
      .get(medioId) as { count: number };

    return row.count;
  },
};
