// Repositorio de auditoría con SQLite
import { getDb } from '../../persistence/sqlite';
import {
  AuditoriaMovimientoDTO,
  AuditoriaCreateDTO,
  AuditoriaFiltrosDTO,
} from '../dto/auditoria.dto';

export const AuditoriaRepo = {
  /**
   * Lista registros de auditoría con filtros opcionales.
   */
  async list(filtros?: AuditoriaFiltrosDTO): Promise<AuditoriaMovimientoDTO[]> {
    const db = getDb();

    const where: string[] = [];
    const params: any[] = [];

    if (filtros?.movimiento_id) {
      where.push('movimiento_id = ?');
      params.push(filtros.movimiento_id);
    }

    if (filtros?.usuario_id) {
      where.push('usuario_id = ?');
      params.push(filtros.usuario_id);
    }

    if (filtros?.fecha_desde) {
      where.push('cambiado_en >= ?');
      params.push(filtros.fecha_desde);
    }

    if (filtros?.fecha_hasta) {
      where.push('cambiado_en <= ?');
      params.push(filtros.fecha_hasta);
    }

    const sql = `
      SELECT *
      FROM auditoria_movimientos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY cambiado_en DESC
    `;

    return db.prepare(sql).all(...params) as AuditoriaMovimientoDTO[];
  },

  /**
   * Obtiene el historial de cambios de un movimiento.
   */
  async getByMovimiento(
    movimientoId: string
  ): Promise<AuditoriaMovimientoDTO[]> {
    const db = getDb();

    return db
      .prepare(
        `
        SELECT *
        FROM auditoria_movimientos
        WHERE movimiento_id = ?
        ORDER BY cambiado_en DESC
      `
      )
      .all(movimientoId) as AuditoriaMovimientoDTO[];
  },

  /**
   * Obtiene historial con nombre de usuario.
   */
  async getByMovimientoEnriquecido(
    movimientoId: string
  ): Promise<Array<AuditoriaMovimientoDTO & { usuario_nombre: string }>> {
    const db = getDb();

    return db
      .prepare(
        `
        SELECT
          a.*,
          u.nombre AS usuario_nombre
        FROM auditoria_movimientos a
        JOIN usuarios u ON u.id = a.usuario_id
        WHERE a.movimiento_id = ?
        ORDER BY a.cambiado_en DESC
      `
      )
      .all(movimientoId) as Array<
      AuditoriaMovimientoDTO & { usuario_nombre: string }
    >;
  },

  /**
   * Registra un cambio en un movimiento.
   */
  async logChange(data: AuditoriaCreateDTO): Promise<AuditoriaMovimientoDTO> {
    const db = getDb();

    const result = db
      .prepare(
        `
        INSERT INTO auditoria_movimientos (
          movimiento_id,
          usuario_id,
          campo,
          valor_anterior,
          valor_nuevo
        ) VALUES (?, ?, ?, ?, ?)
      `
      )
      .run(
        data.movimiento_id,
        data.usuario_id,
        data.campo,
        data.valor_anterior,
        data.valor_nuevo
      );

    // Retornar el registro creado
    const row = db
      .prepare(`SELECT * FROM auditoria_movimientos WHERE id = ?`)
      .get(result.lastInsertRowid) as AuditoriaMovimientoDTO;

    return row;
  },

  /**
   * Registra múltiples cambios en batch.
   */
  async logChanges(entries: AuditoriaCreateDTO[]): Promise<void> {
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO auditoria_movimientos (
        movimiento_id,
        usuario_id,
        campo,
        valor_anterior,
        valor_nuevo
      ) VALUES (?, ?, ?, ?, ?)
    `);

    // Ejecutar en una transacción
    const insertMany = db.transaction((items: AuditoriaCreateDTO[]) => {
      for (const item of items) {
        stmt.run(
          item.movimiento_id,
          item.usuario_id,
          item.campo,
          item.valor_anterior,
          item.valor_nuevo
        );
      }
    });

    insertMany(entries);
  },
};
