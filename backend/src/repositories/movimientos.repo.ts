import { getDb } from '../../persistence/sqlite';
import {
  MovimientoDTO,
  MovimientoEnriquecidoDTO,
  MovimientoCreateDTO,
  MovimientoUpdateDTO,
  MovimientoFiltrosDTO,
} from '../dto/movimientos.dto';
import { IdFactory } from '../utils/idFactory';

// Tipo interno que requiere sentido
type MovimientoCreateInput = Omit<MovimientoCreateDTO, 'confirmar_duplicado'> & {
  sentido: 'ingreso' | 'egreso';
};

// Row de la BD (usa nombres de columnas SQLite)
type MovimientoDbRow = {
  id: string;
  fecha: string;
  categoria_movimiento_id: string;
  sentido: 'ingreso' | 'egreso';
  monto: number;
  medio_pago_id: string;
  nombre_cliente: string | null;
  nota: string | null;
  usuario_creador_id: string;
  created_at: string;
  updated_at: string | null;
};

// Mapea row de BD a DTO
function mapRowToDto(row: MovimientoDbRow): MovimientoDTO {
  return {
    id: row.id,
    fecha: row.fecha,
    categoria_movimiento_id: row.categoria_movimiento_id,
    sentido: row.sentido,
    monto: row.monto,
    medio_pago_id: row.medio_pago_id,
    nombre_cliente: row.nombre_cliente,
    nota: row.nota,
    created_by_user_id: row.usuario_creador_id,
    created_at: row.created_at,
    updated_by_user_id: null, // La BD no tiene este campo aún
    updated_at: row.updated_at,
  };
}

export const MovimientosRepo = {
  /**
   * Lista movimientos con filtros opcionales.
   */
  async list(filtros?: MovimientoFiltrosDTO): Promise<MovimientoDTO[]> {
    const db = getDb();

    const where: string[] = [];
    const params: any[] = [];

    if (filtros?.fecha_desde) {
      where.push('fecha >= ?');
      params.push(filtros.fecha_desde);
    }

    if (filtros?.fecha_hasta) {
      where.push('fecha <= ?');
      params.push(filtros.fecha_hasta);
    }

    if (filtros?.categoria_id) {
      where.push('categoria_movimiento_id = ?');
      params.push(filtros.categoria_id);
    }

    if (filtros?.medio_pago_id) {
      where.push('medio_pago_id = ?');
      params.push(filtros.medio_pago_id);
    }

    if (filtros?.created_by_user_id) {
      where.push('usuario_creador_id = ?');
      params.push(filtros.created_by_user_id);
    }

    const sql = `
      SELECT *
      FROM movimientos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY fecha DESC, created_at DESC
    `;

    const rows = db.prepare(sql).all(...params) as MovimientoDbRow[];

    return rows.map(mapRowToDto);
  },

  /**
   * Lista movimientos con datos enriquecidos.
   */
  async listEnriquecidos(
    filtros?: MovimientoFiltrosDTO
  ): Promise<MovimientoEnriquecidoDTO[]> {
    const db = getDb();

    const where: string[] = [];
    const params: any[] = [];

    if (filtros?.fecha_desde) {
      where.push('m.fecha >= ?');
      params.push(filtros.fecha_desde);
    }

    if (filtros?.fecha_hasta) {
      where.push('m.fecha <= ?');
      params.push(filtros.fecha_hasta);
    }

    if (filtros?.categoria_id) {
      where.push('m.categoria_movimiento_id = ?');
      params.push(filtros.categoria_id);
    }

    if (filtros?.medio_pago_id) {
      where.push('m.medio_pago_id = ?');
      params.push(filtros.medio_pago_id);
    }

    if (filtros?.created_by_user_id) {
      where.push('m.usuario_creador_id = ?');
      params.push(filtros.created_by_user_id);
    }

    const sql = `
      SELECT
        m.id,
        m.fecha,
        m.categoria_movimiento_id,
        m.sentido,
        m.monto,
        m.medio_pago_id,
        m.nombre_cliente,
        m.nota,
        m.usuario_creador_id AS created_by_user_id,
        m.created_at,
        m.updated_at,
        c.nombre AS categoria_nombre,
        m.sentido AS categoria_sentido,
        mp.nombre AS medio_pago_nombre,
        u.nombre AS created_by_nombre
      FROM movimientos m
      JOIN categorias_movimiento c ON c.id = m.categoria_movimiento_id
      JOIN medios_pago mp ON mp.id = m.medio_pago_id
      JOIN usuarios u ON u.id = m.usuario_creador_id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY m.fecha DESC, m.created_at DESC
    `;

    const rows = db.prepare(sql).all(...params) as Array<
      MovimientoEnriquecidoDTO & { updated_by_user_id?: null }
    >;

    return rows.map((row) => ({
      ...row,
      updated_by_user_id: null,
      updated_by_nombre: null,
    }));
  },

  /**
   * Busca un movimiento por ID.
   */
  async findById(id: string): Promise<MovimientoDTO | null> {
    const db = getDb();

    const row = db
      .prepare(`SELECT * FROM movimientos WHERE id = ?`)
      .get(id) as MovimientoDbRow | undefined;

    if (!row) return null;

    return mapRowToDto(row);
  },

  /**
   * Busca un movimiento por ID con datos enriquecidos.
   */
  async findByIdEnriquecido(
    id: string
  ): Promise<MovimientoEnriquecidoDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT
          m.id,
          m.fecha,
          m.categoria_movimiento_id,
          m.sentido,
          m.monto,
          m.medio_pago_id,
          m.nombre_cliente,
          m.nota,
          m.usuario_creador_id AS created_by_user_id,
          m.created_at,
          m.updated_at,
          c.nombre AS categoria_nombre,
          m.sentido AS categoria_sentido,
          mp.nombre AS medio_pago_nombre,
          u.nombre AS created_by_nombre
        FROM movimientos m
        JOIN categorias_movimiento c ON c.id = m.categoria_movimiento_id
        JOIN medios_pago mp ON mp.id = m.medio_pago_id
        JOIN usuarios u ON u.id = m.usuario_creador_id
        WHERE m.id = ?
      `
      )
      .get(id) as
      | (MovimientoEnriquecidoDTO & { updated_by_user_id?: null })
      | undefined;

    if (!row) return null;

    return {
      ...row,
      updated_by_user_id: null,
      updated_by_nombre: null,
    };
  },

  /**
   * Busca posibles duplicados.
   */
  async findDuplicado(params: {
    categoria_movimiento_id: string;
    medio_pago_id: string;
    monto: number;
    nombre_cliente: string | null;
    fecha: string;
  }): Promise<MovimientoDTO | null> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT *
        FROM movimientos
        WHERE categoria_movimiento_id = ?
          AND medio_pago_id = ?
          AND monto = ?
          AND fecha = ?
          AND IFNULL(nombre_cliente, '') = IFNULL(?, '')
        LIMIT 1
      `
      )
      .get(
        params.categoria_movimiento_id,
        params.medio_pago_id,
        params.monto,
        params.fecha,
        params.nombre_cliente
      ) as MovimientoDbRow | undefined;

    if (!row) return null;

    return mapRowToDto(row);
  },

  /**
   * Crea un nuevo movimiento.
   */
  async create(
    payload: MovimientoCreateInput,
    userId: string
  ): Promise<MovimientoDTO> {
    const db = getDb();
    const id = IdFactory.movimiento();

    db.prepare(
      `
      INSERT INTO movimientos (
        id,
        fecha,
        categoria_movimiento_id,
        sentido,
        monto,
        medio_pago_id,
        nombre_cliente,
        nota,
        usuario_creador_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      payload.fecha,
      payload.categoria_movimiento_id,
      payload.sentido,
      payload.monto,
      payload.medio_pago_id,
      payload.nombre_cliente ?? null,
      payload.nota ?? null,
      userId
    );

    const created = await this.findById(id);
    if (!created) {
      throw new Error(`Movimiento ${id} no encontrado después de crear`);
    }
    return created;
  },

  /**
   * Actualiza un movimiento existente.
   */
  async update(
    id: string,
    payload: MovimientoUpdateDTO,
    userId: string
  ): Promise<MovimientoDTO | null> {
    const db = getDb();

    const fields: string[] = [];
    const values: any[] = [];

    if (payload.fecha !== undefined) {
      fields.push('fecha = ?');
      values.push(payload.fecha);
    }

    if (payload.monto !== undefined) {
      fields.push('monto = ?');
      values.push(payload.monto);
    }

    if (payload.nombre_cliente !== undefined) {
      fields.push('nombre_cliente = ?');
      values.push(payload.nombre_cliente);
    }

    if (payload.nota !== undefined) {
      fields.push('nota = ?');
      values.push(payload.nota);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const result = db
      .prepare(
        `
        UPDATE movimientos
        SET ${fields.join(', ')}
        WHERE id = ?
      `
      )
      .run(...values, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Cuenta movimientos por categoría (reemplaza countByOpcion).
   */
  async countByCategoria(categoriaId: string): Promise<number> {
    const db = getDb();

    const row = db
      .prepare(
        `
        SELECT COUNT(*) as count
        FROM movimientos
        WHERE categoria_movimiento_id = ?
      `
      )
      .get(categoriaId) as { count: number };

    return row.count;
  },
};
