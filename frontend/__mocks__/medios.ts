// Medios de pago configurables
export type MedioPago = {
  id: string;
  nombre: string;
  activo: boolean;
  orden: number;
  fecha_actualizacion: string;
  created_at: string;
  updated_at: string;
};

export const mediosSeed: MedioPago[] = [
  { id: 'm-efectivo', nombre: 'Efectivo', activo: true, orden: 1, fecha_actualizacion: '2024-01-01' },
  { id: 'm-transf', nombre: 'Transferencia', activo: true, orden: 2, fecha_actualizacion: '2024-01-01' },
  { id: 'm-mp', nombre: 'Mercado Pago', activo: true, orden: 3, fecha_actualizacion: '2024-01-01' },
  { id: 'm-debito', nombre: 'Débito', activo: true, orden: 4, fecha_actualizacion: '2024-01-01' },
  { id: 'm-credito', nombre: 'Crédito', activo: true, orden: 5, fecha_actualizacion: '2024-01-01' },
];
