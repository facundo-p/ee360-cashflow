// Lógica de negocio de movimientos.
// Reglas según business-rules.md sección 2.

import { MovimientosRepo } from '../repositories/movimientos.repo';
import { CategoriasRepo } from '../repositories/categorias.repo';
import { AuditoriaRepo } from '../repositories/auditoria.repo';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { 
  MovimientoDTO, 
  MovimientoEnriquecidoDTO,
  MovimientoEnriquecidoConPermisosDTO,
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
      | 'CATEGORIA_NOT_FOUND'
      | 'CATEGORIA_INACTIVE'
      | 'VALIDATION_ERROR'
      | 'PERMISSION_DENIED'
      | 'EDIT_WINDOW_EXPIRED'
      | 'DELETE_WINDOW_EXPIRED'
  ) {
    super(message);
    this.name = 'MovimientoError';
  }
}

/**
 * Verifica si un usuario puede editar/eliminar un movimiento.
 * Reglas:
 * - Admin puede editar/eliminar cualquier movimiento
 * - Coach solo puede editar/eliminar sus propios movimientos dentro de 24hs
 */
function verificarPermisos(
  movimiento: MovimientoDTO, 
  usuario: UsuarioDTO
): { permitido: boolean; razon?: string } {
  // Admin puede hacer todo
  if (usuario.rol === 'admin') {
    return { permitido: true };
  }

  // Coach no puede modificar movimientos de otros
  if (movimiento.created_by_user_id !== usuario.id) {
    return { 
      permitido: false, 
      razon: 'No puede modificar movimientos creados por otros usuarios' 
    };
  }

  // Ventana temporal de 24 horas
  const createdAt = new Date(movimiento.created_at);
  const ahora = new Date();
  const horasTranscurridas = (ahora.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (horasTranscurridas > VENTANA_EDICION_HORAS) {
    return { 
      permitido: false, 
      razon: `Solo puede modificar movimientos dentro de las primeras ${VENTANA_EDICION_HORAS} horas` 
    };
  }

  return { permitido: true };
}

/**
 * Calcula permisos de edición/eliminación para un movimiento dado un usuario.
 * Usado internamente para calcular can_edit y can_delete.
 */
function calcularPermisosMovimiento(
  movimiento: { created_by_user_id: string; created_at: string },
  usuario: UsuarioDTO
): { can_edit: boolean; can_delete: boolean } {
  // Admin puede hacer todo
  if (usuario.rol === 'admin') {
    return { can_edit: true, can_delete: true };
  }

  // Coach no puede modificar movimientos de otros
  if (movimiento.created_by_user_id !== usuario.id) {
    return { can_edit: false, can_delete: false };
  }

  // Ventana temporal de 24 horas
  const createdAt = new Date(movimiento.created_at);
  const ahora = new Date();
  const horasTranscurridas = (ahora.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (horasTranscurridas > VENTANA_EDICION_HORAS) {
    return { can_edit: false, can_delete: false };
  }

  return { can_edit: true, can_delete: true };
}

export const MovimientosService = {
  /**
   * Lista movimientos con filtros y permisos del usuario.
   */
  list: async (
    filtros?: MovimientoFiltrosDTO, 
    usuario?: UsuarioDTO
  ): Promise<MovimientoEnriquecidoConPermisosDTO[]> => {
    const movimientos = await MovimientosRepo.listEnriquecidos(filtros);
    
    // Si no hay usuario, no hay permisos
    if (!usuario) {
      return movimientos.map(m => ({
        ...m,
        can_edit: false,
        can_delete: false,
      }));
    }

    // Calcular permisos para cada movimiento
    return movimientos.map(m => ({
      ...m,
      ...calcularPermisosMovimiento(m, usuario),
    }));
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
  
    if (payload.monto <= 0) {
      throw new MovimientoError('El monto debe ser mayor a 0', 'VALIDATION_ERROR');
    }
  
    const fechaMovimiento = new Date(payload.fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (fechaMovimiento > hoy) {
      throw new MovimientoError('La fecha no puede ser futura', 'VALIDATION_ERROR');
    }
  
    const categoria = await CategoriasRepo.findById(payload.categoria_movimiento_id);
    if (!categoria) {
      throw new MovimientoError('La categoría no existe', 'CATEGORIA_NOT_FOUND');
    }
  
    if (!categoria.activo) {
      throw new MovimientoError('La categoría está inactiva', 'CATEGORIA_INACTIVE');
    }
  
    if (categoria.sentido === 'egreso' && (!payload.nota || !payload.nota.trim())) {
      throw new MovimientoError(
        'La nota es obligatoria para movimientos de egreso',
        'VALIDATION_ERROR'
      );
    }
  
    const duplicado = await MovimientosRepo.findDuplicado({
      categoria_movimiento_id: payload.categoria_movimiento_id,
      medio_pago_id: payload.medio_pago_id,
      monto: payload.monto,
      nombre_cliente: payload.nombre_cliente ?? null,
      fecha: payload.fecha,
    });
  
    if (duplicado && !payload.confirmar_duplicado) {
      return {
        created: false,
        warning: 'posible_movimiento_duplicado',
        movimiento_duplicado_id: duplicado.id,
        requires_confirmation: true,
      };
    }
  
    const movimiento = await MovimientosRepo.create(
      {
        ...payload,
        sentido: categoria.sentido,
      },
      userId
    );
  
    return {
      created: true,
      movimiento,
      ...(duplicado && {
        warning: 'posible_movimiento_duplicado',
        movimiento_duplicado_id: duplicado.id,
      }),
    };
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
    // Obtener movimiento actual (solo activos)
    const movimiento = await MovimientosRepo.findActiveById(id);
    if (!movimiento) {
      throw new MovimientoError('Movimiento no encontrado', 'NOT_FOUND');
    }

    // === Verificar permisos ===
    const permisos = verificarPermisos(movimiento, usuario);
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

    const categoria = await CategoriasRepo.findById(
      payload.categoria_movimiento_id ?? movimiento.categoria_movimiento_id
    );
    
    if (!categoria) {
      throw new MovimientoError('La categoría no existe', 'CATEGORIA_NOT_FOUND');
    }
    
    if (categoria.sentido === 'egreso') {
      const notaFinal =
        payload.nota !== undefined ? payload.nota : movimiento.nota;
    
      if (!notaFinal || !notaFinal.trim()) {
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
   * Elimina (soft delete) un movimiento.
   * Reglas:
   * - Admin puede eliminar cualquier movimiento
   * - Coach solo puede eliminar sus propios movimientos dentro de 24hs
   */
  delete: async (id: string, usuario: UsuarioDTO): Promise<void> => {
    // Obtener movimiento actual (solo activos)
    const movimiento = await MovimientosRepo.findActiveById(id);
    if (!movimiento) {
      throw new MovimientoError('Movimiento no encontrado', 'NOT_FOUND');
    }

    // Verificar permisos
    const permisos = verificarPermisos(movimiento, usuario);
    if (!permisos.permitido) {
      if (permisos.razon?.includes('24 horas')) {
        throw new MovimientoError(permisos.razon, 'DELETE_WINDOW_EXPIRED');
      }
      throw new MovimientoError(permisos.razon || 'No tiene permisos', 'PERMISSION_DENIED');
    }

    // Registrar eliminación en auditoría
    await AuditoriaRepo.logChange({
      movimiento_id: id,
      usuario_id: usuario.id,
      campo: 'eliminado',
      valor_anterior: JSON.stringify({
        fecha: movimiento.fecha,
        monto: movimiento.monto,
        categoria_movimiento_id: movimiento.categoria_movimiento_id,
        medio_pago_id: movimiento.medio_pago_id,
        nombre_cliente: movimiento.nombre_cliente,
        nota: movimiento.nota,
      }),
      valor_nuevo: null,
    });

    // Soft delete
    const deleted = await MovimientosRepo.softDelete(id, usuario.id);
    if (!deleted) {
      throw new MovimientoError('Error al eliminar el movimiento', 'NOT_FOUND');
    }
  },

  /**
   * Verifica si un usuario puede editar un movimiento específico.
   * Útil para el frontend para mostrar/ocultar botón de editar.
   */
  puedeEditar: async (
    movimientoId: string, 
    usuario: UsuarioDTO
  ): Promise<{ permitido: boolean; razon?: string }> => {
    const movimiento = await MovimientosRepo.findActiveById(movimientoId);
    if (!movimiento) {
      return { permitido: false, razon: 'Movimiento no encontrado' };
    }
    return verificarPermisos(movimiento, usuario);
  },

  /**
   * Verifica si un usuario puede eliminar un movimiento específico.
   * Mismas reglas que editar: admin todo, coach solo propios < 24hs.
   */
  puedeEliminar: async (
    movimientoId: string, 
    usuario: UsuarioDTO
  ): Promise<{ permitido: boolean; razon?: string }> => {
    const movimiento = await MovimientosRepo.findActiveById(movimientoId);
    if (!movimiento) {
      return { permitido: false, razon: 'Movimiento no encontrado' };
    }
    return verificarPermisos(movimiento, usuario);
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
    'categoria_movimiento_id',
    'medio_pago_id',
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
