// Acceso a datos de medios de pago usando el store in-memory.
// TODO: Reemplazar con SQLite cuando se implemente persistencia.

import { Store } from '../data/store';
import { 
  MedioPagoDTO, 
  MedioPagoCreateDTO, 
  MedioPagoUpdateDTO 
} from '../dto/medios.dto';

export const MediosRepo = {
  /**
   * Lista todos los medios de pago ordenados.
   */
  list: async (soloActivos = false): Promise<MedioPagoDTO[]> => {
    return Store.medios.list(soloActivos);
  },

  /**
   * Busca un medio por ID.
   */
  findById: async (id: string): Promise<MedioPagoDTO | null> => {
    return Store.medios.findById(id);
  },

  /**
   * Busca un medio por nombre (case insensitive).
   */
  findByNombre: async (nombre: string): Promise<MedioPagoDTO | null> => {
    return Store.medios.findByNombre(nombre);
  },

  /**
   * Crea un nuevo medio de pago.
   */
  create: async (payload: MedioPagoCreateDTO): Promise<MedioPagoDTO> => {
    const medios = Store.medios.list();
    const maxOrden = medios.reduce((max, m) => Math.max(max, m.orden), 0);
    
    return Store.medios.create({
      nombre: payload.nombre,
      activo: true,
      orden: payload.orden ?? maxOrden + 1,
    });
  },

  /**
   * Actualiza un medio de pago existente.
   */
  update: async (id: string, payload: MedioPagoUpdateDTO): Promise<MedioPagoDTO | null> => {
    return Store.medios.update(id, payload);
  },

  /**
   * Verifica si hay opciones activas que usan este medio.
   */
  tieneOpcionesActivas: async (medioId: string): Promise<boolean> => {
    return Store.medios.hasActiveOpciones(medioId);
  },
};
