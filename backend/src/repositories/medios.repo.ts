// Acceso a medios de pago configurables (placeholder).
import { MedioPagoDTO } from '../dto/medios.dto';

export const MediosRepo = {
  list: async (): Promise<MedioPagoDTO[]> => [],
  findById: async (_id: string): Promise<MedioPagoDTO | null> => null,
};


