// DTOs de categorías de movimiento (antes "tipos").
// Representa la clasificación base: ingreso/egreso.

export type CategoriaMovimientoDTO = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
};

export type CategoriaCreateDTO = {
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  orden?: number;
};

export type CategoriaUpdateDTO = Partial<Omit<CategoriaCreateDTO, 'sentido'>> & {
  activo?: boolean;
};
