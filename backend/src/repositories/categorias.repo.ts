// Acceso a persistencia de categorías (stub).
// TODO: Implementar con base de datos real.

import { CategoriaMovimientoDTO, CategoriaCreateDTO, CategoriaUpdateDTO } from '../dto/categorias.dto';

export const CategoriasRepo = {
  /**
   * Lista todas las categorías.
   * @param soloActivas - Si true, filtra solo las activas
   */
  list: async (soloActivas = false): Promise<CategoriaMovimientoDTO[]> => {
    // TODO: Implementar persistencia
    return [];
  },

  /**
   * Busca una categoría por ID.
   */
  findById: async (id: string): Promise<CategoriaMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Busca una categoría por nombre (para validar unicidad).
   */
  findByNombre: async (nombre: string): Promise<CategoriaMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Crea una nueva categoría.
   */
  create: async (payload: CategoriaCreateDTO): Promise<CategoriaMovimientoDTO> => {
    // TODO: Implementar persistencia
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      nombre: payload.nombre,
      sentido: payload.sentido,
      activo: true,
      orden: payload.orden ?? 0,
      created_at: now,
      updated_at: now,
    };
  },

  /**
   * Actualiza una categoría existente.
   */
  update: async (id: string, payload: CategoriaUpdateDTO): Promise<CategoriaMovimientoDTO | null> => {
    // TODO: Implementar persistencia
    return null;
  },

  /**
   * Verifica si existen opciones activas que usen esta categoría.
   * Usado para validar antes de desactivar.
   */
  tieneOpcionesActivas: async (categoriaId: string): Promise<boolean> => {
    // TODO: Implementar persistencia
    return false;
  },
};
