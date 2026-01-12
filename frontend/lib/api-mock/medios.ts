// API Mock para Medios de Pago con persistencia localStorage
import { mediosSeed, MedioPago } from '../../__mocks__/medios';

const STORAGE_KEY = 'mock_medios';

function getStoredData(): MedioPago[] {
  if (typeof window === 'undefined') return mediosSeed;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mediosSeed;
}

function saveData(data: MedioPago[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// List all medios (optionally filter by activo)
export async function listMedios(soloActivos = false): Promise<MedioPago[]> {
  const data = getStoredData();
  const filtered = soloActivos ? data.filter((m) => m.activo) : data;
  return filtered.sort((a, b) => a.orden - b.orden);
}

// Get single medio by ID
export async function getMedio(id: string): Promise<MedioPago | null> {
  const data = getStoredData();
  return data.find((m) => m.id === id) ?? null;
}

// Create new medio
export async function createMedio(
  input: Omit<MedioPago, 'id' | 'fecha_actualizacion'>
): Promise<MedioPago> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  const newMedio: MedioPago = {
    ...input,
    id: `m-${Date.now()}`,
    fecha_actualizacion: now,
  };
  data.push(newMedio);
  saveData(data);
  return newMedio;
}

// Update medio
export async function updateMedio(
  id: string,
  updates: Partial<Omit<MedioPago, 'id'>>
): Promise<MedioPago | null> {
  const data = getStoredData();
  const index = data.findIndex((m) => m.id === id);
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
export async function toggleMedioActivo(id: string): Promise<MedioPago | null> {
  const data = getStoredData();
  const medio = data.find((m) => m.id === id);
  if (!medio) return null;
  return updateMedio(id, { activo: !medio.activo });
}

// Check if medio has dependent opciones
export async function hasDependentOpciones(medioId: string): Promise<boolean> {
  const { listOpciones } = await import('./opciones');
  const opciones = await listOpciones();
  return opciones.some((o) => o.medio_pago_id === medioId && o.activo);
}

// Reorder medios
export async function reorderMedios(orderedIds: string[]): Promise<MedioPago[]> {
  const data = getStoredData();
  const now = new Date().toISOString().slice(0, 10);
  
  orderedIds.forEach((id, index) => {
    const medio = data.find((m) => m.id === id);
    if (medio) {
      medio.orden = index + 1;
      medio.fecha_actualizacion = now;
    }
  });
  
  saveData(data);
  return data.sort((a, b) => a.orden - b.orden);
}
