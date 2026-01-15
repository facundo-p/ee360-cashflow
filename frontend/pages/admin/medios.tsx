// ABM de Medios de Pago
import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layouts';
import AdminGuard from '../../components/admin/AdminGuard';
import { MedioPago } from '../../__mocks__/medios';
import {
  listMedios,
  createMedio,
  updateMedio,
  toggleMedioActivo,
  hasDependentOpciones,
} from '../../lib/api-mock/medios';

type FormData = {
  nombre: string;
  orden: number;
};

const emptyForm: FormData = {
  nombre: '',
  orden: 99,
};

export default function AdminMediosPage() {
  const [medios, setMedios] = useState<MedioPago[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const data = await listMedios();
    setMedios(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNew = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, orden: medios.length + 1 });
    setShowForm(true);
    setError('');
  };

  const handleEdit = (medio: MedioPago) => {
    setEditingId(medio.id);
    setFormData({
      nombre: medio.nombre,
      orden: medio.orden,
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
        await updateMedio(editingId, formData);
      } else {
        await createMedio({ ...formData, activo: true });
      }
      await loadData();
      handleCancel();
    } catch (e) {
      setError('Error al guardar');
    }
    setLoading(false);
  };

  const handleToggleActivo = async (medio: MedioPago) => {
    if (medio.activo) {
      const hasDeps = await hasDependentOpciones(medio.id);
      if (hasDeps) {
        alert('No se puede desactivar: hay opciones activas que usan este medio de pago');
        return;
      }
    }
    await toggleMedioActivo(medio.id);
    await loadData();
  };

  return (
    <AppLayout>
      <AdminGuard>
        <div className="admin-page-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Medios de Pago</h1>
          </header>

          <div className="admin-page">
            <div className="admin-toolbar">
              <button onClick={handleNew} className="admin-btn-primary">
                + Nuevo Medio de Pago
              </button>
            </div>

            {showForm && (
              <div className="admin-form-card">
                <h3>{editingId ? 'Editar Medio de Pago' : 'Nuevo Medio de Pago'}</h3>
                
                <div className="admin-form-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="admin-input"
                    placeholder="Ej: Efectivo"
                  />
                </div>

                <div className="admin-form-field">
                  <label>Orden</label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 1 })}
                    className="admin-input"
                    min={1}
                    placeholder="Posición en la lista"
                  />
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
                    <th>Orden</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Actualizado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {medios.map((medio) => (
                    <tr key={medio.id} className={!medio.activo ? 'admin-row-inactive' : ''}>
                      <td>{medio.orden}</td>
                      <td>{medio.nombre}</td>
                      <td>
                        <span className={`admin-badge admin-badge-${medio.activo ? 'activo' : 'inactivo'}`}>
                          {medio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{medio.fecha_actualizacion}</td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => handleEdit(medio)} className="admin-btn-sm">
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActivo(medio)}
                            className={`admin-btn-sm ${medio.activo ? 'admin-btn-danger' : 'admin-btn-success'}`}
                          >
                            {medio.activo ? 'Desactivar' : 'Activar'}
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
