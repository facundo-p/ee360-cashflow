// Lógica de negocio de categorías de movimiento.
// Reglas según business-rules.md sección 3.

import { CategoriasRepo } from '../repositories/categorias.repo';
import { OpcionesRepo } from '../repositories/opciones.repo';
import { 
  CategoriaMovimientoDTO, 
  CategoriaCreateDTO, 
  CategoriaUpdateDTO 
} from '../dto/categorias.dto';

// Errores de dominio
export class CategoriaError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'DUPLICATE_NAME' | 'HAS_ACTIVE_OPTIONS' | 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'CategoriaError';
  }
}

export const CategoriasService = {
  /**
   * Lista categorías.
   * Regla 3.2: Usuarios NO admin solo pueden listar tipos activos.
   */
  list: async (options: { soloActivas?: boolean } = {}): Promise<CategoriaMovimientoDTO[]> => {
    return CategoriasRepo.list(options.soloActivas ?? false);
  },

  /**
   * Obtiene una categoría por ID.
   */
  get: async (id: string): Promise<CategoriaMovimientoDTO> => {
    const categoria = await CategoriasRepo.findById(id);
    if (!categoria) {
      throw new CategoriaError('Categoría no encontrada', 'NOT_FOUND');
    }
    return categoria;
  },

  /**
   * Crea una nueva categoría.
   * Regla 3.1: Solo usuarios admin pueden crear.
   * (La validación de rol se hace en el controller/middleware)
   */
  create: async (payload: CategoriaCreateDTO): Promise<CategoriaMovimientoDTO> => {
    // Validar nombre único
    const existente = await CategoriasRepo.findByNombre(payload.nombre.trim());
    if (existente) {
      throw new CategoriaError(
        `Ya existe una categoría con el nombre "${payload.nombre.trim()}"`,
        'DUPLICATE_NAME'
      );
    }

    // Validar campos requeridos
    if (!payload.nombre?.trim()) {
      throw new CategoriaError('El nombre es requerido', 'VALIDATION_ERROR');
    }
    if (!['ingreso', 'egreso'].includes(payload.sentido)) {
      throw new CategoriaError('El sentido debe ser "ingreso" o "egreso"', 'VALIDATION_ERROR');
    }

    return CategoriasRepo.create(payload);
  },

  /**
   * Actualiza una categoría.
   * Regla 3.1: Solo usuarios admin pueden editar.
   */
  update: async (id: string, payload: CategoriaUpdateDTO): Promise<CategoriaMovimientoDTO> => {
    // Verificar que existe
    const categoria = await CategoriasRepo.findById(id);
    if (!categoria) {
      throw new CategoriaError('Categoría no encontrada', 'NOT_FOUND');
    }

    // Si cambia el nombre, validar unicidad
    if (payload.nombre && payload.nombre !== categoria.nombre) {
      const existente = await CategoriasRepo.findByNombre(payload.nombre.trim());
      if (existente) {
        throw new CategoriaError(
          `Ya existe una categoría con el nombre "${payload.nombre.trim()}"`,
          'DUPLICATE_NAME'
        );
      }
    }

    const updated = await CategoriasRepo.update(id, payload);
    if (!updated) {
      throw new CategoriaError('Error al actualizar la categoría', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Activa o desactiva una categoría.
   * Regla 3.1: Solo admin puede activar/desactivar.
   * Regla 3.2: Una categoría desactivada no puede usarse para nuevos movimientos.
   */
  toggle: async (id: string): Promise<CategoriaMovimientoDTO> => {
    const categoria = await CategoriasRepo.findById(id);
    if (!categoria) {
      throw new CategoriaError('Categoría no encontrada', 'NOT_FOUND');
    }

    // Si está activa y se quiere desactivar, validar que no tenga opciones activas
    if (categoria.activo) {
      const tieneOpciones = await CategoriasRepo.tieneOpcionesActivas(id);
      if (tieneOpciones) {
        throw new CategoriaError(
          'No se puede desactivar una categoría que tiene opciones activas. Desactive primero las opciones.',
          'HAS_ACTIVE_OPTIONS'
        );
      }
    }

    const updated = await CategoriasRepo.update(id, { activo: !categoria.activo });
    if (!updated) {
      throw new CategoriaError('Error al actualizar la categoría', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Verifica si la categoría tiene opciones activas.
   */
  hasActiveOpciones: async (id: string): Promise<boolean> => {
    return CategoriasRepo.tieneOpcionesActivas(id);
  },
};
