// ABM de Categorías de Movimiento
import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layouts';
import AdminGuard from '../../components/admin/AdminGuard';
import type { CategoriaMovimiento } from '../../lib/api-unified/categorias';
import {
  listCategorias,
  createCategoria,
  updateCategoria,
  toggleCategoriaActivo,
  hasDependentOpciones,
} from '../../lib/api-unified/categorias';

type FormData = {
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
};

const emptyForm: FormData = {
  nombre: '',
  sentido: 'ingreso',
  es_plan: false,
};

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaMovimiento[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const data = await listCategorias();
    setCategorias(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError('');
  };

  const handleEdit = (cat: CategoriaMovimiento) => {
    setEditingId(cat.id);
    setFormData({
      nombre: cat.nombre,
      sentido: cat.sentido,
      es_plan: cat.es_plan,
    });
    setShowForm(true);
    setError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        await updateCategoria(editingId, formData);
      } else {
        await createCategoria({ ...formData, activo: true });
      }
      await loadData();
      handleCancel();
    } catch (e) {
      setError('Error al guardar');
    }
    setLoading(false);
  };

  const handleToggleActivo = async (cat: CategoriaMovimiento) => {
    if (cat.activo) {
      // Check dependencies before deactivating
      const hasDeps = await hasDependentOpciones(cat.id);
      if (hasDeps) {
        alert('No se puede desactivar: hay opciones activas que usan esta categoría');
        return;
      }
    }
    await toggleCategoriaActivo(cat.id);
    await loadData();
  };

  return (
    <AppLayout>
      <AdminGuard>
        <div className="admin-page-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Categorías de Movimiento</h1>
          </header>

          <div className="admin-page">
            <div className="admin-toolbar">
              <button onClick={handleNew} className="admin-btn-primary">
                + Nueva Categoría
              </button>
            </div>

            {showForm && (
              <div className="admin-form-card">
                <h3>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                
                <div className="admin-form-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="admin-input"
                    placeholder="Ej: Plan mensual"
                  />
                </div>

                <div className="admin-form-field">
                  <label>Sentido</label>
                  <select
                    value={formData.sentido}
                    onChange={(e) => setFormData({ ...formData, sentido: e.target.value as 'ingreso' | 'egreso' })}
                    className="admin-select"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>

                <div className="admin-form-field">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.es_plan}
                      onChange={(e) => setFormData({ ...formData, es_plan: e.target.checked })}
                    />
                    Es plan (requiere nombre de cliente)
                  </label>
                </div>

                {error && <p className="admin-error">{error}</p>}

                <div className="admin-form-actions">
                  <button onClick={handleCancel} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="admin-btn-primary">
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Sentido</th>
                    <th>Es Plan</th>
                    <th>Estado</th>
                    <th>Actualizado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id} className={!cat.activo ? 'admin-row-inactive' : ''}>
                      <td>{cat.nombre}</td>
                      <td>
                        <span className={`admin-badge admin-badge-${cat.sentido}`}>
                          {cat.sentido}
                        </span>
                      </td>
                      <td>{cat.es_plan ? 'Sí' : 'No'}</td>
                      <td>
                        <span className={`admin-badge admin-badge-${cat.activo ? 'activo' : 'inactivo'}`}>
                          {cat.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{cat.fecha_actualizacion}</td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => handleEdit(cat)} className="admin-btn-sm">
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActivo(cat)}
                            className={`admin-btn-sm ${cat.activo ? 'admin-btn-danger' : 'admin-btn-success'}`}
                          >
                            {cat.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AppLayout>
  );
}
