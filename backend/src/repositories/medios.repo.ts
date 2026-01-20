import { getDb } from '../../persistence/sqlite';
import {
  MedioPagoDTO,
  MedioPagoCreateDTO,
  MedioPagoUpdateDTO,
} from '../dto/medios.dto';
import { IdFactory } from '../utils/idFactory';

export const MediosRepo = {
  /**
   * Lista todos los medios de pago ordenados.
   */
  async list(soloActivos = false): Promise<MedioPagoDTO[]> {
    const db = getDb();

    const sql = `
      SELECT
        id,
        nombre,
        activo,
        orden,
        created_at,
        updated_at
      FROM medios_pago
      ${soloActivos ? 'WHERE activo = 1' : ''}
      ORDER BY orden ASC
    `;

    return db.prepare(sql).all().map((row: any) => ({
      ...row,
      activo: Boolean(row.activo),
    }));
  },

  /**
   * Busca un medio por ID.
   */
  async findById(id: string): Promise<MedioPagoDTO | null> {
    const db = getDb();

    const row: any = db.prepare(`
      SELECT *
      FROM medios_pago
      WHERE id = ?
    `).get(id);

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Busca un medio por nombre (case insensitive).
   */
  async findByNombre(nombre: string): Promise<MedioPagoDTO | null> {
    const db = getDb();

    const row: any = db.prepare(`
      SELECT *
      FROM medios_pago
      WHERE lower(nombre) = lower(?)
      LIMIT 1
    `).get(nombre.trim());

    if (!row) return null;

    return {
      ...row,
      activo: Boolean(row.activo),
    };
  },

  /**
   * Crea un nuevo medio de pago.
   */
  async create(payload: MedioPagoCreateDTO): Promise<MedioPagoDTO> {
    const db = getDb();

    // Calcular orden automáticamente si no viene
    const { maxOrden } = db.prepare(`
      SELECT COALESCE(MAX(orden), 0) AS maxOrden
      FROM medios_pago
    `).get() as { maxOrden: number };

    const orden = payload.orden ?? maxOrden + 1;

    const id = IdFactory.medio(payload.nombre);

    db.prepare(`
      INSERT INTO medios_pago (
        id,
        nombre,
        activo,
        orden
      ) VALUES (?, ?, 1, ?)
    `).run(id, payload.nombre, orden);

    return this.findById(id) as Promise<MedioPagoDTO>;
  },

  /**
   * Actualiza un medio de pago existente.
   */
  async update(id: string, payload: MedioPagoUpdateDTO): Promise<MedioPagoDTO | null> {

    const db = getDb();

    const fields: string[] = [];
    const values: any[] = [];

    if (payload.nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(payload.nombre);
    }

    if (payload.activo !== undefined) {
      fields.push('activo = ?');
      values.push(payload.activo ? 1 : 0);
    }

    if (payload.orden !== undefined) {
      fields.push('orden = ?');
      values.push(payload.orden);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = datetime(\'now\')');

    const result = db.prepare(`
      UPDATE medios_pago
      SET ${fields.join(', ')}
      WHERE id = ?
    `).run(...values, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Verifica si hay opciones activas que usan este medio.
   */
  async tieneOpcionesActivas(medioId: string): Promise<boolean> {
    const db = getDb();

    const row = db.prepare(`
      SELECT 1
      FROM opciones_movimiento
      WHERE medio_pago_id = ?
        AND activo = 1
      LIMIT 1
    `).get(medioId);

    return Boolean(row);
  },
};
