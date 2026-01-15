// DTOs de categorías de movimiento.
// Representa la clasificación base: ingreso/egreso.

export type CategoriaDTO = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoriaCreateDTO = {
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan?: boolean;
};

export type CategoriaUpdateDTO = Partial<Omit<CategoriaCreateDTO, 'sentido'>> & {
  activo?: boolean;
};

// Alias for backwards compatibility
export type CategoriaMovimientoDTO = CategoriaDTO;
