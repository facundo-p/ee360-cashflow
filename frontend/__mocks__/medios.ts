// Medios de pago configurables
export type MedioPago = {
  id: string;
  nombre: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export const mediosSeed: MedioPago[] = [
  { id: 'm-efectivo', nombre: 'Efectivo', activo: true, orden: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-transf', nombre: 'Transferencia', activo: true, orden: 2, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-mp', nombre: 'Mercado Pago', activo: true, orden: 3, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-debito', nombre: 'Débito', activo: true, orden: 4, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'm-credito', nombre: 'Crédito', activo: true, orden: 5, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];
