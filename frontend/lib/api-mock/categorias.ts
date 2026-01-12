// API Mock para Categorías de Movimiento con persistencia localStorage
import { categoriasSeed, CategoriaMovimiento } from '../../__mocks__/categorias';

const STORAGE_KEY = 'mock_categorias';

function getStoredData(): CategoriaMovimiento[] {
  if (typeof window === 'undefined') return categoriasSeed;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : categoriasSeed;
}

function saveData(data: CategoriaMovimiento[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// List all categorias (optionally filter by activo)
export async function listCategorias(soloActivas = false): Promise<CategoriaMovimiento[]> {
  const data = getStoredData();
  return soloActivas ? data.filter((c) => c.activo) : data;
}

// Get single categoria by ID
export async function getCategoria(id: string): Promise<CategoriaMovimiento | null> {
  const data = getStoredData();
  return data.find((c) => c.id === id) ?? null;
}

// Create new categoria
export async function createCategoria(
  input: Omit<CategoriaMovimiento, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>
): Promise<CategoriaMovimiento> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  const newCategoria: CategoriaMovimiento = {
    ...input,
    id: `cat-${Date.now()}`,
    fecha_creacion: now,
    fecha_actualizacion: now,
  };
  data.push(newCategoria);
  saveData(data);
  return newCategoria;
}

// Update categoria
export async function updateCategoria(
  id: string,
  updates: Partial<Omit<CategoriaMovimiento, 'id' | 'fecha_creacion'>>
): Promise<CategoriaMovimiento | null> {
  const data = getStoredData();
  const index = data.findIndex((c) => c.id === id);
  if (index === -1) return null;
  
  data[index] = {
    ...data[index],
    ...updates,
    fecha_actualizacion: new Date().toISOString().slice(0, 10),
  };
  saveData(data);
  return data[index];
}

// Soft-delete: toggle activo status
export async function toggleCategoriaActivo(id: string): Promise<CategoriaMovimiento | null> {
  const data = getStoredData();
  const categoria = data.find((c) => c.id === id);
  if (!categoria) return null;
  return updateCategoria(id, { activo: !categoria.activo });
}

// Check if categoria has dependent opciones
export async function hasDependentOpciones(categoriaId: string): Promise<boolean> {
  // Import dynamically to avoid circular dependency
  const { listOpciones } = await import('./opciones');
  const opciones = await listOpciones();
  return opciones.some((o) => o.categoria_id === categoriaId && o.activo);
}
