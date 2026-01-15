// Acceso a datos de opciones de movimiento usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { 
  OpcionMovimientoDTO, 
  OpcionMovimientoEnriquecidaDTO,
  OpcionCreateDTO, 
  OpcionUpdateDTO 
} from '../dto/opciones.dto';

export const OpcionesRepo = {
  /**
   * Lista todas las opciones.
   */
  list: async (soloActivas = false): Promise<OpcionMovimientoDTO[]> => {
    return Store.opciones.list(soloActivas);
  },

  /**
   * Lista opciones con datos enriquecidos (join con categoría y medio).
   */
  listEnriquecidas: async (soloActivas = false): Promise<OpcionMovimientoEnriquecidaDTO[]> => {
    return Store.opciones.listEnriquecidas(soloActivas);
  },

  /**
   * Busca una opción por ID.
   */
  findById: async (id: string): Promise<OpcionMovimientoDTO | null> => {
    return Store.opciones.findById(id);
  },

  /**
   * Busca una opción por ID con datos enriquecidos.
   */
  findByIdEnriquecida: async (id: string): Promise<OpcionMovimientoEnriquecidaDTO | null> => {
    return Store.opciones.findByIdEnriquecida(id);
  },

  /**
   * Verifica si existe una opción con la misma combinación categoría+medio.
   */
  findByCategoriaMedio: async (
    categoriaId: string, 
    medioId: string
  ): Promise<OpcionMovimientoDTO | null> => {
    return Store.opciones.findByCategoriaMedio(categoriaId, medioId);
  },

  /**
   * Crea una nueva opción.
   */
  create: async (payload: OpcionCreateDTO): Promise<OpcionMovimientoDTO> => {
    const opciones = Store.opciones.list();
    const maxOrden = opciones.reduce((max, o) => Math.max(max, o.orden), 0);
    const now = new Date().toISOString();
    
    return Store.opciones.create({
      categoria_id: payload.categoria_id,
      medio_pago_id: payload.medio_pago_id,
      nombre_display: payload.nombre_display,
      monto_sugerido: payload.monto_sugerido ?? null,
      icono: payload.icono ?? 'default.png',
      activo: true,
      orden: payload.orden ?? maxOrden + 1,
      fecha_actualizacion_precio: payload.monto_sugerido ? now : null,
    });
  },

  /**
   * Actualiza una opción existente.
   */
  update: async (id: string, payload: OpcionUpdateDTO): Promise<OpcionMovimientoDTO | null> => {
    return Store.opciones.update(id, payload);
  },

  /**
   * Actualiza el precio de múltiples opciones.
   */
  updatePrecios: async (
    updates: Array<{ id: string; monto_sugerido: number }>
  ): Promise<number> => {
    let count = 0;
    for (const update of updates) {
      const result = Store.opciones.update(update.id, { monto_sugerido: update.monto_sugerido });
      if (result) count++;
    }
    return count;
  },

  /**
   * Verifica si existen movimientos que usen esta opción.
   */
  tieneMovimientos: async (opcionId: string): Promise<boolean> => {
    return Store.opciones.hasMovimientos(opcionId);
  },

  /**
   * Cuenta opciones activas que usan una categoría.
   */
  countByCategoria: async (categoriaId: string, soloActivas = true): Promise<number> => {
    return Store.opciones.countByCategoria(categoriaId, soloActivas);
  },

  /**
   * Cuenta opciones activas que usan un medio de pago.
   */
  countByMedio: async (medioId: string, soloActivas = true): Promise<number> => {
    return Store.opciones.countByMedio(medioId, soloActivas);
  },
};
