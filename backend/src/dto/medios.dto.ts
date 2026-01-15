// DTOs de medios de pago configurables.

export type MedioPagoDTO = {
  id: string;
  nombre: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export type MedioPagoCreateDTO = {
  nombre: string;
  orden?: number;
};

export type MedioPagoUpdateDTO = Partial<MedioPagoCreateDTO> & {
  activo?: boolean;
};