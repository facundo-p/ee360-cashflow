// Acceso a datos de categorías usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { 
  CategoriaDTO, 
  CategoriaCreateDTO, 
  CategoriaUpdateDTO 
} from '../dto/categorias.dto';

export const CategoriasRepo = {
  /**
   * Lista todas las categorías.
   */
  list: async (soloActivas = false): Promise<CategoriaDTO[]> => {
    return Store.categorias.list(soloActivas);
  },

  /**
   * Busca una categoría por ID.
   */
  findById: async (id: string): Promise<CategoriaDTO | null> => {
    return Store.categorias.findById(id);
  },

  /**
   * Busca una categoría por nombre (case insensitive).
   */
  findByNombre: async (nombre: string): Promise<CategoriaDTO | null> => {
    return Store.categorias.findByNombre(nombre);
  },

  /**
   * Crea una nueva categoría.
   */
  create: async (payload: CategoriaCreateDTO): Promise<CategoriaDTO> => {
    return Store.categorias.create({
      nombre: payload.nombre,
      sentido: payload.sentido,
      es_plan: payload.es_plan ?? false,
      activo: true,
    });
  },

  /**
   * Actualiza una categoría existente.
   */
  update: async (id: string, payload: CategoriaUpdateDTO): Promise<CategoriaDTO | null> => {
    return Store.categorias.update(id, payload);
  },

  /**
   * Verifica si hay opciones activas que usan esta categoría.
   */
  tieneOpcionesActivas: async (categoriaId: string): Promise<boolean> => {
    return Store.categorias.hasActiveOpciones(categoriaId);
  },
};
