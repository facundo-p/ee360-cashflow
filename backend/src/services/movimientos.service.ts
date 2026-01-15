// Lógica de negocio de movimientos.
// Reglas según business-rules.md sección 2.

import { MovimientosRepo } from '../repositories/movimientos.repo';
import { OpcionesRepo } from '../repositories/opciones.repo';
import { AuditoriaRepo } from '../repositories/auditoria.repo';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { 
  MovimientoDTO, 
  MovimientoEnriquecidoDTO,
  MovimientoCreateDTO, 
  MovimientoUpdateDTO,
  MovimientoFiltrosDTO,
  MovimientoCreateResponseDTO
} from '../dto/movimientos.dto';
import { UsuarioDTO } from '../dto/usuarios.dto';

// Constantes
const VENTANA_EDICION_HORAS = 24;

// Errores de dominio
export class MovimientoError extends Error {
  constructor(
    message: string,
    public code: 
      | 'NOT_FOUND' 
      | 'OPCION_NOT_FOUND'
      | 'OPCION_INACTIVE'
      | 'VALIDATION_ERROR'
      | 'PERMISSION_DENIED'
      | 'EDIT_WINDOW_EXPIRED'
  ) {
    super(message);
    this.name = 'MovimientoError';
  }
}

/**
 * Verifica si un usuario puede editar un movimiento.
 * Reglas 2.2 y 2.3 de business-rules.md
 */
function puedeEditar(
  movimiento: MovimientoDTO, 
  usuario: UsuarioDTO
): { permitido: boolean; razon?: string } {
  // Regla 2.2: Admin puede editar cualquier movimiento
  if (usuario.rol === 'admin') {
    return { permitido: true };
  }

  // Regla 2.2: Usuario NO admin no puede editar movimientos de otros
  if (movimiento.created_by_user_id !== usuario.id) {
    return { 
      permitido: false, 
      razon: 'No puede editar movimientos creados por otros usuarios' 
    };
  }

  // Regla 2.3: Ventana temporal de 24 horas
  const createdAt = new Date(movimiento.created_at);
  const ahora = new Date();
  const horasTranscurridas = (ahora.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (horasTranscurridas > VENTANA_EDICION_HORAS) {
    return { 
      permitido: false, 
      razon: `Solo puede editar movimientos dentro de las primeras ${VENTANA_EDICION_HORAS} horas` 
    };
  }

  return { permitido: true };
}

export const MovimientosService = {
  /**
   * Lista movimientos con filtros.
   */
  list: async (filtros?: MovimientoFiltrosDTO): Promise<MovimientoEnriquecidoDTO[]> => {
    return MovimientosRepo.listEnriquecidos(filtros);
  },

  /**
   * Obtiene un movimiento por ID.
   */
  get: async (id: string): Promise<MovimientoEnriquecidoDTO> => {
    const movimiento = await MovimientosRepo.findByIdEnriquecido(id);
    if (!movimiento) {
      throw new MovimientoError('Movimiento no encontrado', 'NOT_FOUND');
    }
    return movimiento;
  },

  /**
   * Crea un nuevo movimiento.
   * Validaciones según sección 2.4 y 2.5 de business-rules.md
   */
  create: async (
    payload: MovimientoCreateDTO, 
    userId: string
  ): Promise<MovimientoCreateResponseDTO> => {
    // === Validaciones básicas (sección 2.5) ===
    
    // Validar monto > 0
    if (!payload.monto || payload.monto <= 0) {
      throw new MovimientoError('El monto debe ser mayor a 0', 'VALIDATION_ERROR');
    }

    // Validar fecha no futura
    const fechaMovimiento = new Date(payload.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999); // Fin del día actual
    if (fechaMovimiento > hoy) {
      throw new MovimientoError('La fecha no puede ser futura', 'VALIDATION_ERROR');
    }

    // Validar que opción exista (con datos enriquecidos para obtener sentido)
    const opcion = await OpcionesRepo.findByIdEnriquecida(payload.opcion_id);
    if (!opcion) {
      throw new MovimientoError('La opción de movimiento no existe', 'OPCION_NOT_FOUND');
    }

    // Validar que opción esté activa
    if (!opcion.activo) {
      throw new MovimientoError(
        'La opción de movimiento está inactiva. No se pueden crear nuevos movimientos con opciones inactivas.',
        'OPCION_INACTIVE'
      );
    }

    // Validar nota obligatoria para egresos
    if (opcion.categoria_sentido === 'egreso' && (!payload.nota || !payload.nota.trim())) {
      throw new MovimientoError(
        'La nota es obligatoria para movimientos de egreso',
        'VALIDATION_ERROR'
      );
    }

    // === Detección de duplicados ANTES de crear (sección 2.4) ===
    const posibleDuplicado = await MovimientosRepo.findDuplicado({
      opcion_id: payload.opcion_id,
      monto: payload.monto,
      nombre_cliente: payload.nombre_cliente ?? null,
      fecha: payload.fecha,
    });

    // Si hay duplicado y el usuario NO ha confirmado → advertir sin crear
    if (posibleDuplicado && !payload.confirmar_duplicado) {
      return {
        created: false,
        warning: 'posible_movimiento_duplicado',
        movimiento_duplicado_id: posibleDuplicado.id,
        requires_confirmation: true,
      };
    }

    // Si no hay duplicado, o el usuario confirmó → crear el movimiento
    const movimiento = await MovimientosRepo.create(payload, userId);

    // Retornar éxito
    const response: MovimientoCreateResponseDTO = { 
      movimiento, 
      created: true 
    };
    
    if (posibleDuplicado) {
      // Se creó a pesar de duplicado (usuario confirmó)
      response.warning = 'posible_movimiento_duplicado';
      response.movimiento_duplicado_id = posibleDuplicado.id;
    }

    return response;
  },

  /**
   * Actualiza un movimiento existente.
   * Reglas 2.1, 2.2, 2.3 de business-rules.md
   */
  update: async (
    id: string, 
    payload: MovimientoUpdateDTO, 
    usuario: UsuarioDTO
  ): Promise<MovimientoDTO> => {
    // Obtener movimiento actual
    const movimiento = await MovimientosRepo.findById(id);
    if (!movimiento) {
      throw new MovimientoError('Movimiento no encontrado', 'NOT_FOUND');
    }

    // === Verificar permisos (sección 2.2 y 2.3) ===
    const permisos = puedeEditar(movimiento, usuario);
    if (!permisos.permitido) {
      if (permisos.razon?.includes('24 horas')) {
        throw new MovimientoError(permisos.razon, 'EDIT_WINDOW_EXPIRED');
      }
      throw new MovimientoError(permisos.razon || 'No tiene permisos', 'PERMISSION_DENIED');
    }

    // === Validaciones básicas (sección 2.5) ===
    if (payload.monto !== undefined && payload.monto <= 0) {
      throw new MovimientoError('El monto debe ser mayor a 0', 'VALIDATION_ERROR');
    }

    if (payload.fecha !== undefined) {
      const fechaMovimiento = new Date(payload.fecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaMovimiento > hoy) {
        throw new MovimientoError('La fecha no puede ser futura', 'VALIDATION_ERROR');
      }
    }

    // Obtener opción actual (para validar sentido)
    const opcionActual = await OpcionesRepo.findByIdEnriquecida(movimiento.opcion_id);
    
    if (payload.opcion_id !== undefined) {
      const opcion = await OpcionesRepo.findByIdEnriquecida(payload.opcion_id);
      if (!opcion) {
        throw new MovimientoError('La opción de movimiento no existe', 'OPCION_NOT_FOUND');
      }
      if (!opcion.activo) {
        throw new MovimientoError(
          'La opción de movimiento está inactiva',
          'OPCION_INACTIVE'
        );
      }
      
      // Validar nota si la nueva opción es egreso
      const notaFinal = payload.nota !== undefined ? payload.nota : movimiento.nota;
      if (opcion.categoria_sentido === 'egreso' && (!notaFinal || !notaFinal.trim())) {
        throw new MovimientoError(
          'La nota es obligatoria para movimientos de egreso',
          'VALIDATION_ERROR'
        );
      }
    } else if (payload.nota !== undefined && opcionActual?.categoria_sentido === 'egreso') {
      // Si se está cambiando la nota y el movimiento es egreso, validar que no esté vacía
      if (!payload.nota || !payload.nota.trim()) {
        throw new MovimientoError(
          'La nota es obligatoria para movimientos de egreso',
          'VALIDATION_ERROR'
        );
      }
    }

    // === Registrar auditoría (sección 2.1) ===
    const cambios = detectarCambios(movimiento, payload);
    if (cambios.length > 0) {
      await AuditoriaRepo.logChanges(
        cambios.map(cambio => ({
          movimiento_id: id,
          usuario_id: usuario.id,
          campo: cambio.campo,
          valor_anterior: cambio.valor_anterior,
          valor_nuevo: cambio.valor_nuevo,
        }))
      );
    }

    // Actualizar
    const updated = await MovimientosRepo.update(id, payload, usuario.id);
    if (!updated) {
      throw new MovimientoError('Error al actualizar el movimiento', 'NOT_FOUND');
    }

    return updated;
  },

  /**
   * Verifica si un usuario puede editar un movimiento específico.
   * Útil para el frontend para mostrar/ocultar botón de editar.
   */
  puedeEditar: async (
    movimientoId: string, 
    usuario: UsuarioDTO
  ): Promise<{ permitido: boolean; razon?: string }> => {
    const movimiento = await MovimientosRepo.findById(movimientoId);
    if (!movimiento) {
      return { permitido: false, razon: 'Movimiento no encontrado' };
    }
    return puedeEditar(movimiento, usuario);
  },

  /**
   * Obtiene el historial de auditoría de un movimiento.
   */
  getHistorial: async (movimientoId: string) => {
    return AuditoriaRepo.getByMovimiento(movimientoId);
  },
};

/**
 * Detecta qué campos cambiaron entre el movimiento actual y el payload.
 */
function detectarCambios(
  actual: MovimientoDTO, 
  payload: MovimientoUpdateDTO
): Array<{ campo: string; valor_anterior: string; valor_nuevo: string }> {
  const cambios: Array<{ campo: string; valor_anterior: string; valor_nuevo: string }> = [];

  const camposAComparar: Array<keyof MovimientoUpdateDTO> = [
    'fecha',
    'opcion_id',
    'monto',
    'nombre_cliente',
    'nota',
  ];

  for (const campo of camposAComparar) {
    if (payload[campo] !== undefined) {
      const valorActual = actual[campo as keyof MovimientoDTO];
      const valorNuevo = payload[campo];

      if (String(valorActual ?? '') !== String(valorNuevo ?? '')) {
        cambios.push({
          campo,
          valor_anterior: String(valorActual ?? ''),
          valor_nuevo: String(valorNuevo ?? ''),
        });
      }
    }
  }

  return cambios;
}