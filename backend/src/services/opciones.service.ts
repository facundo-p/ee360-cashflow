// Lógica de negocio de opciones de movimiento.
// Combina categorías + medios de pago.

import { OpcionesRepo } from '../repositories/opciones.repo';
import { CategoriasRepo } from '../repositories/categorias.repo';
import { MediosRepo } from '../repositories/medios.repo';
import { 
  OpcionMovimientoDTO, 
  OpcionMovimientoEnriquecidaDTO,
  OpcionCreateDTO, 
  OpcionUpdateDTO,
  AumentoPreciosDTO,
  AumentoPreciosResultDTO
} from '../dto/opciones.dto';

// Errores de dominio
export class OpcionError extends Error {
  constructor(
    message: string,
    public code: 
      | 'NOT_FOUND' 
      | 'DUPLICATE_COMBINATION' 
      | 'CATEGORIA_NOT_FOUND'
      | 'DUPLICATE_NAME'
      | 'CATEGORIA_INACTIVE'
      | 'MEDIO_NOT_FOUND'
      | 'MEDIO_INACTIVE'
      | 'HAS_MOVEMENTS'
      | 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'OpcionError';
  }
}

export const OpcionesService = {
  /**
   * Lista opciones sin enriquecer.
   */
  list: async (options: { soloActivas?: boolean } = {}): Promise<OpcionMovimientoDTO[]> => {
    return OpcionesRepo.list(options.soloActivas ?? false);
  },

  /**
   * Lista opciones con datos enriquecidos.
   * Para la botonera del frontend.
   */
  listEnriquecidas: async (options: { soloActivas?: boolean } = {}): Promise<OpcionMovimientoEnriquecidaDTO[]> => {
    return OpcionesRepo.listEnriquecidas(options.soloActivas ?? false);
  },

  /**
   * Obtiene una opción por ID.
   */
  get: async (id: string): Promise<OpcionMovimientoEnriquecidaDTO> => {
    const opcion = await OpcionesRepo.findByIdEnriquecida(id);
    if (!opcion) {
      throw new OpcionError('Opción no encontrada', 'NOT_FOUND');
    }
    return opcion;
  },

  /**
   * Crea una nueva opción.
   * Valida que categoría y medio existan y estén activos.
   */
  create: async (payload: OpcionCreateDTO): Promise<OpcionMovimientoDTO> => {
    // Validar campos requeridos
    if (!payload.nombre_display?.trim()) {
      throw new OpcionError('El nombre es requerido', 'VALIDATION_ERROR');
    }
    if (!payload.categoria_id) {
      throw new OpcionError('La categoría es requerida', 'VALIDATION_ERROR');
    }
    if (!payload.medio_pago_id) {
      throw new OpcionError('El medio de pago es requerido', 'VALIDATION_ERROR');
    }

    // Validar que la categoría exista y esté activa
    const categoria = await CategoriasRepo.findById(payload.categoria_id);
    if (!categoria) {
      throw new OpcionError('La categoría no existe', 'CATEGORIA_NOT_FOUND');
    }
    if (!categoria.activo) {
      throw new OpcionError('La categoría está inactiva', 'CATEGORIA_INACTIVE');
    }

    // Validar que el medio exista y esté activo
    const medio = await MediosRepo.findById(payload.medio_pago_id);
    if (!medio) {
      throw new OpcionError('El medio de pago no existe', 'MEDIO_NOT_FOUND');
    }
    if (!medio.activo) {
      throw new OpcionError('El medio de pago está inactivo', 'MEDIO_INACTIVE');
    }

    // Validar que no exista otra opción con la misma combinación
    const existente = await OpcionesRepo.findByCategoriaMedio(
      payload.categoria_id,
      payload.medio_pago_id
    );
    if (existente) {
      throw new OpcionError(
        'Ya existe una opción con esta combinación de categoría y medio de pago',
        'DUPLICATE_COMBINATION'
      );
    }

    // Validar que no exista otra opción con el mismo nombre
    const existenteNombre = await OpcionesRepo.findByNombre(payload.nombre_display.trim());
    if (existenteNombre) {
        throw new OpcionError(
          `Ya existe una opción con el nombre "${payload.nombre_display.trim()}"`,
          'DUPLICATE_NAME'
        );
      }

    // Validar monto sugerido si se proporciona
    if (payload.monto_sugerido !== undefined && payload.monto_sugerido !== null) {
      if (payload.monto_sugerido <= 0) {
        throw new OpcionError('El monto sugerido debe ser mayor a 0', 'VALIDATION_ERROR');
      }
    }

    return OpcionesRepo.create(payload);
  },

  /**
   * Actualiza una opción.
   */
  update: async (id: string, payload: OpcionUpdateDTO): Promise<OpcionMovimientoDTO> => {
    // Verificar que existe
    const opcion = await OpcionesRepo.findById(id);
    if (!opcion) {
      throw new OpcionError('Opción no encontrada', 'NOT_FOUND');
    }

    // Validar monto sugerido si se proporciona
    if (payload.monto_sugerido !== undefined && payload.monto_sugerido !== null) {
      if (payload.monto_sugerido <= 0) {
        throw new OpcionError('El monto sugerido debe ser mayor a 0', 'VALIDATION_ERROR');
      }
    }

    // Si cambia el nombre, validar unicidad
    if (payload.nombre_display && payload.nombre_display !== opcion.nombre_display) {
      const existente = await OpcionesRepo.findByNombre(payload.nombre_display.trim());
      if (existente) {
        throw new OpcionError(
          `Ya existe una opción con el nombre "${payload.nombre_display.trim()}"`,
          'DUPLICATE_NAME'
        );
      }
    }

    const updated = await OpcionesRepo.update(id, payload);
    if (!updated) {
      throw new OpcionError('Error al actualizar la opción', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Activa o desactiva una opción.
   */
  toggle: async (id: string): Promise<OpcionMovimientoDTO> => {
    const opcion = await OpcionesRepo.findById(id);
    if (!opcion) {
      throw new OpcionError('Opción no encontrada', 'NOT_FOUND');
    }

    // Si se quiere activar, validar que categoría y medio estén activos
    if (!opcion.activo) {
      const categoria = await CategoriasRepo.findById(opcion.categoria_id);
      if (!categoria?.activo) {
        throw new OpcionError(
          'No se puede activar la opción porque su categoría está inactiva',
          'CATEGORIA_INACTIVE'
        );
      }

      const medio = await MediosRepo.findById(opcion.medio_pago_id);
      if (!medio?.activo) {
        throw new OpcionError(
          'No se puede activar la opción porque su medio de pago está inactivo',
          'MEDIO_INACTIVE'
        );
      }
    }

    const updated = await OpcionesRepo.update(id, { activo: !opcion.activo });
    if (!updated) {
      throw new OpcionError('Error al actualizar la opción', 'NOT_FOUND');
    }
    return updated;
  },

  /**
   * Actualiza precios de múltiples opciones con un porcentaje.
   * Para el caso de uso: "cada 3 meses aumentamos los precios".
   */
  aumentarPrecios: async (params: AumentoPreciosDTO): Promise<AumentoPreciosResultDTO> => {
    // Validar porcentaje
    if (params.porcentaje <= 0 || params.porcentaje > 100) {
      throw new OpcionError(
        'El porcentaje debe ser mayor a 0 y menor o igual a 100',
        'VALIDATION_ERROR'
      );
    }

    // Obtener opciones a actualizar
    let opciones: OpcionMovimientoDTO[];
    if (params.opcion_ids && params.opcion_ids.length > 0) {
      // Actualizar solo las especificadas
      const todas = await OpcionesRepo.list(false);
      opciones = todas.filter(o => params.opcion_ids!.includes(o.id) && o.monto_sugerido !== null);
    } else {
      // Actualizar todas las activas con monto
      const activas = await OpcionesRepo.list(true);
      opciones = activas.filter(o => o.monto_sugerido !== null);
    }

    const detalles: AumentoPreciosResultDTO['detalles'] = [];
    const updates: Array<{ id: string; monto_sugerido: number }> = [];

    for (const opcion of opciones) {
      if (opcion.monto_sugerido === null) continue;

      let nuevoPrecio = opcion.monto_sugerido * (1 + params.porcentaje / 100);

      // Redondear si se especifica
      if (params.redondear_a && params.redondear_a > 0) {
        nuevoPrecio = Math.round(nuevoPrecio / params.redondear_a) * params.redondear_a;
      } else {
        nuevoPrecio = Math.round(nuevoPrecio);
      }

      updates.push({ id: opcion.id, monto_sugerido: nuevoPrecio });
      detalles.push({
        opcion_id: opcion.id,
        nombre: opcion.nombre_display,
        precio_anterior: opcion.monto_sugerido,
        precio_nuevo: nuevoPrecio,
      });
    }

    // Ejecutar actualización masiva
    const actualizadas = await OpcionesRepo.updatePrecios(updates);

    return {
      actualizadas,
      detalles,
    };
  },

  /**
   * Lista los iconos disponibles.
   * Para selector de iconos en el ABM.
   */
  listIconosDisponibles: async (): Promise<string[]> => {
    // Por ahora hardcoded, podría leerse del filesystem
    return [
      'default.png',
      'clase-efectivo.png',
      'plan-mensual-efectivo.png',
      'plan-mensual-transferencia.png',
      'plan-semestral-efectivo.png',
      'plan-semestral-tarjeta.png',
      'clase-kids.png',
      'plan-kids.png',
      'bebida.png',
      'servicios-gym.png',
      'venta-mercaderia.png',
      'egreso-general.png',
    ];
  },
};
