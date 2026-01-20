// Lógica de negocio de medios de pago.
// Reglas según business-rules.md sección 4.

import { MediosRepo } from '../repositories/medios.repo';
import { 
  MedioPagoDTO, 
  MedioPagoCreateDTO, 
  MedioPagoUpdateDTO 
} from '../dto/medios.dto';

// Errores de dominio
export class MedioPagoError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'DUPLICATE_NAME' | 'HAS_ACTIVE_OPTIONS' | 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'MedioPagoError';
  }
}

export const MediosService = {
  /**
   * Lista medios de pago.
   * Regla 4.2: Solo medios activos pueden mostrarse como opción.
   */
  list: async (options: { soloActivos?: boolean } = {}): Promise<MedioPagoDTO[]> => {
    return MediosRepo.list(options.soloActivos ?? false);
  },

  /**
   * Obtiene un medio de pago por ID.
   */
  get: async (id: string): Promise<MedioPagoDTO> => {
    const medio = await MediosRepo.findById(id);
    if (!medio) {
      throw new MedioPagoError('Medio de pago no encontrado', 'NOT_FOUND');
    }
    return medio;
  },

  /**
   * Crea un nuevo medio de pago.
   * Regla 4.1: Solo usuarios admin pueden crear.
   */
  create: async (payload: MedioPagoCreateDTO): Promise<MedioPagoDTO> => {
    // Validar nombre único
    const existente = await MediosRepo.findByNombre(payload.nombre);
    if (existente) {
      throw new MedioPagoError(
        `Ya existe un medio de pago con el nombre "${payload.nombre}"`,
        'DUPLICATE_NAME'
      );
    }

    // Validar campos requeridos
    if (!payload.nombre?.trim()) {
      throw new MedioPagoError('El nombre es requerido', 'VALIDATION_ERROR');
    }

    return MediosRepo.create(payload);
  },

  /**
   * Actualiza un medio de pago.
   * Regla 4.1: Solo usuarios admin pueden editar.
   */
  update: async (id: string, payload: MedioPagoUpdateDTO): Promise<MedioPagoDTO> => {
    // Verificar que existe
    const medio = await MediosRepo.findById(id);
    if (!medio) {
      throw new MedioPagoError('Medio de pago no encontrado', 'NOT_FOUND');
    }

    // Si cambia el nombre, validar unicidad
    if (payload.nombre && payload.nombre !== medio.nombre) {
      const existente = await MediosRepo.findByNombre(payload.nombre.trim());
      if (existente) {
        throw new MedioPagoError(
          `Ya existe un medio de pago con el nombre "${payload.nombre.trim()}"`,
          'DUPLICATE_NAME'
        );
      }
    }

    const updated = await MediosRepo.update(id, payload);
    if (!updated) {
      throw new MedioPagoError('Error al actualizar el medio de pago', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Activa o desactiva un medio de pago.
   * Regla 4.1: Solo admin puede activar/desactivar.
   * Regla 4.2: Un medio inactivo no puede sugerirse para nuevos movimientos.
   */
  toggle: async (id: string): Promise<MedioPagoDTO> => {
    const medio = await MediosRepo.findById(id);
    if (!medio) {
      throw new MedioPagoError('Medio de pago no encontrado', 'NOT_FOUND');
    }

    // Si está activo y se quiere desactivar, validar dependencias
    if (medio.activo) {
      const tieneOpciones = await MediosRepo.tieneOpcionesActivas(id);
      if (tieneOpciones) {
        throw new MedioPagoError(
          'No se puede desactivar un medio de pago que tiene opciones activas. Desactive primero las opciones.',
          'HAS_ACTIVE_OPTIONS'
        );
      }
    }

    const updated = await MediosRepo.update(id, { activo: !medio.activo });
    if (!updated) {
      throw new MedioPagoError('Error al actualizar el medio de pago', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Cambia el orden de un medio de pago.
   * Regla 4.1: Solo admin puede cambiar orden.
   */
  updateOrden: async (id: string, orden: number): Promise<MedioPagoDTO> => {
    const medio = await MediosRepo.findById(id);
    if (!medio) {
      throw new MedioPagoError('Medio de pago no encontrado', 'NOT_FOUND');
    }

    const updated = await MediosRepo.update(id, { orden });
    if (!updated) {
      throw new MedioPagoError('Error al actualizar el medio de pago', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Verifica si el medio tiene opciones activas.
   */
  hasActiveOpciones: async (id: string): Promise<boolean> => {
    return MediosRepo.tieneOpcionesActivas(id);
  },
};