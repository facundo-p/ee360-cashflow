// ABM de Opciones de Movimiento (combinaciones Categoría + Medio + Precio)
import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layouts';
import AdminGuard from '../../components/admin/AdminGuard';
import type { OpcionMovimiento } from '../../lib/api-unified/opciones';
import type { CategoriaMovimiento } from '../../lib/api-unified/categorias';
import type { MedioPago } from '../../lib/api-unified/medios';
import {
  listOpciones,
  createOpcion,
  updateOpcion,
  toggleOpcionActivo,
  listIconosDisponibles,
  aumentarPrecios,
} from '../../lib/api-unified/opciones';
import { listCategorias } from '../../lib/api-unified/categorias';
import { listMedios } from '../../lib/api-unified/medios';

type FormData = {
  categoria_id: string;
  medio_pago_id: string;
  nombre_display: string;
  icono: string;
  monto_sugerido: number | null;
  orden: number;
};

// Estado para edición inline por fila
type InlineEdit = {
  nombre_display: string;
  monto_sugerido: number | null;
};

const emptyForm: FormData = {
  categoria_id: '',
  medio_pago_id: '',
  nombre_display: '',
  icono: 'default.png',
  monto_sugerido: null,
  orden: 99,
};

export default function AdminOpcionesPage() {
  const [opciones, setOpciones] = useState<OpcionMovimiento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMovimiento[]>([]);
  const [medios, setMedios] = useState<MedioPago[]>([]);
  const [iconos, setIconos] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkPercentage, setBulkPercentage] = useState<number>(10);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Estado para edición inline
  const [inlineEdits, setInlineEdits] = useState<Record<string, InlineEdit>>({});

  const loadData = async () => {
    const [opts, cats, meds, icons] = await Promise.all([
      listOpciones(),
      listCategorias(true), // Solo activas
      listMedios(true), // Solo activos
      listIconosDisponibles(),
    ]);
    setOpciones(opts);
    setCategorias(cats);
    setMedios(meds);
    setIconos(icons);
    // Reset inline edits cuando se recargan los datos
    setInlineEdits({});
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoriaName = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? 'Sin categoría';
  const getMedioName = (id: string) => medios.find((m) => m.id === id)?.nombre ?? 'Sin medio';
  const getCategoria = (id: string) => categorias.find((c) => c.id === id);

  // Verificar si una fila tiene cambios inline
  const hasInlineChanges = (opcion: OpcionMovimiento): boolean => {
    const edit = inlineEdits[opcion.id];
    if (!edit) return false;
    return edit.nombre_display !== opcion.nombre_display || 
           edit.monto_sugerido !== opcion.monto_sugerido;
  };

  // Obtener valor actual (editado o original)
  const getInlineValue = (opcion: OpcionMovimiento, field: keyof InlineEdit) => {
    const edit = inlineEdits[opcion.id];
    if (edit) return edit[field];
    return opcion[field];
  };

  // Manejar cambio en campo inline
  const handleInlineChange = (opcionId: string, field: keyof InlineEdit, value: string | number | null) => {
    const opcion = opciones.find((o) => o.id === opcionId);
    if (!opcion) return;

    setInlineEdits((prev) => ({
      ...prev,
      [opcionId]: {
        nombre_display: prev[opcionId]?.nombre_display ?? opcion.nombre_display,
        monto_sugerido: prev[opcionId]?.monto_sugerido ?? opcion.monto_sugerido,
        [field]: value,
      },
    }));
  };

  // Guardar cambios inline de una fila
  const handleInlineSave = async (opcionId: string) => {
    const edit = inlineEdits[opcionId];
    if (!edit) return;

    setLoading(true);
    try {
      await updateOpcion(opcionId, {
        nombre_display: edit.nombre_display,
        monto_sugerido: edit.monto_sugerido,
      });
      await loadData();
    } catch (e) {
      alert('Error al guardar');
    }
    setLoading(false);
  };

  // Cancelar cambios inline de una fila
  const handleInlineCancel = (opcionId: string) => {
    setInlineEdits((prev) => {
      const next = { ...prev };
      delete next[opcionId];
      return next;
    });
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      categoria_id: categorias[0]?.id ?? '',
      medio_pago_id: medios[0]?.id ?? '',
      orden: opciones.length + 1,
    });
    setShowForm(true);
    setError('');
  };

  const handleEdit = (opcion: OpcionMovimiento) => {
    setEditingId(opcion.id);
    setFormData({
      categoria_id: opcion.categoria_id,
      medio_pago_id: opcion.medio_pago_id,
      nombre_display: opcion.nombre_display,
      icono: opcion.icono,
      monto_sugerido: opcion.monto_sugerido,
      orden: opcion.orden,
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
    if (!formData.nombre_display.trim()) {
      setError('El nombre para mostrar es requerido');
      return;
    }
    if (!formData.categoria_id) {
      setError('La categoría es requerida');
      return;
    }
    if (!formData.medio_pago_id) {
      setError('El medio de pago es requerido');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        await updateOpcion(editingId, formData);
      } else {
        await createOpcion({ ...formData, activo: true });
      }
      await loadData();
      handleCancel();
    } catch (e) {
      setError('Error al guardar: ' + (e as Error).message);
    }
    setLoading(false);
  };

  const handleToggleActivo = async (opcion: OpcionMovimiento) => {
    await toggleOpcionActivo(opcion.id);
    await loadData();
  };

  const handleBulkPriceUpdate = async () => {
    if (bulkPercentage === 0) return;
    
    const confirmMsg = bulkPercentage > 0
      ? `¿Aumentar todos los precios un ${bulkPercentage}%?`
      : `¿Reducir todos los precios un ${Math.abs(bulkPercentage)}%?`;
    
    if (!confirm(confirmMsg)) return;
    
    setLoading(true);
    await aumentarPrecios(bulkPercentage);
    await loadData();
    setShowBulkUpdate(false);
    setLoading(false);
  };

  return (
    <AppLayout>
      <AdminGuard>
        <div className="admin-page-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Opciones de Movimiento</h1>
          </header>

          <div className="admin-page">
            <div className="admin-toolbar">
              <button onClick={handleNew} className="admin-btn-primary">
                + Nueva Opción
              </button>
              <button 
                onClick={() => setShowBulkUpdate(!showBulkUpdate)} 
                className="admin-btn-secondary"
              >
                Actualizar Precios
              </button>
            </div>

            {showBulkUpdate && (
              <div className="admin-form-card admin-bulk-update">
                <h3>Actualización Masiva de Precios</h3>
                <p className="admin-form-description">Ajusta todos los precios sugeridos en un porcentaje.</p>
                
                <div className="admin-form-field">
                  <label>Porcentaje de ajuste</label>
                  <div className="admin-input-group">
                    <input
                      type="number"
                      value={bulkPercentage}
                      onChange={(e) => setBulkPercentage(parseInt(e.target.value) || 0)}
                      className="admin-input"
                      placeholder="10"
                    />
                    <span>%</span>
                  </div>
                  <small>Usa valores negativos para reducir precios</small>
                </div>

                <div className="admin-form-actions">
                  <button onClick={() => setShowBulkUpdate(false)} className="admin-btn-secondary">
                    Cancelar
                  </button>
                  <button onClick={handleBulkPriceUpdate} disabled={loading} className="admin-btn-primary">
                    {loading ? 'Actualizando...' : 'Aplicar a Todos'}
                  </button>
                </div>
              </div>
            )}

            {showForm && (
              <div className="admin-form-card">
                <h3>{editingId ? 'Editar Opción' : 'Nueva Opción'}</h3>
                
                <div className="admin-form-row">
                  <div className="admin-form-field">
                    <label>Categoría</label>
                    <select
                      value={formData.categoria_id}
                      onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                      className="admin-select"
                    >
                      <option value="">Seleccionar...</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre} ({cat.sentido})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-field">
                    <label>Medio de Pago</label>
                    <select
                      value={formData.medio_pago_id}
                      onChange={(e) => setFormData({ ...formData, medio_pago_id: e.target.value })}
                      className="admin-select"
                    >
                      <option value="">Seleccionar...</option>
                      {medios.map((medio) => (
                        <option key={medio.id} value={medio.id}>
                          {medio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-form-field">
                  <label>Nombre para mostrar</label>
                  <input
                    type="text"
                    value={formData.nombre_display}
                    onChange={(e) => setFormData({ ...formData, nombre_display: e.target.value })}
                    className="admin-input"
                    placeholder="Ej: Plan mensual - Efectivo"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-field">
                    <label>Monto Sugerido</label>
                    <input
                      type="number"
                      value={formData.monto_sugerido ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        monto_sugerido: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      className="admin-input"
                      placeholder="Dejar vacío si no aplica"
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
                </div>

                <div className="admin-form-field">
                  <label>Ícono</label>
                  <div className="admin-icon-selector">
                    {iconos.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icono: icon })}
                        className={`admin-icon-option ${formData.icono === icon ? 'admin-icon-selected' : ''}`}
                      >
                        <img src={`/icons/${icon}`} alt={icon} />
                        <span>{icon.replace('.png', '')}</span>
                      </button>
                    ))}
                  </div>
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
                    <th>Ícono</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Medio</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {opciones.map((opcion) => {
                    const categoria = getCategoria(opcion.categoria_id);
                    const hasChanges = hasInlineChanges(opcion);
                    const currentNombre = getInlineValue(opcion, 'nombre_display') as string;
                    const currentMonto = getInlineValue(opcion, 'monto_sugerido') as number | null;
                    
                    return (
                      <tr key={opcion.id} className={!opcion.activo ? 'admin-row-inactive' : ''}>
                        <td>{opcion.orden}</td>
                        <td>
                          <img 
                            src={`/icons/${opcion.icono}`} 
                            alt="" 
                            className="admin-table-icon"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={currentNombre}
                            onChange={(e) => handleInlineChange(opcion.id, 'nombre_display', e.target.value)}
                            className="admin-inline-input"
                            placeholder="Nombre para mostrar"
                          />
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${categoria?.sentido ?? 'ingreso'}`}>
                            {getCategoriaName(opcion.categoria_id)}
                          </span>
                        </td>
                        <td>{getMedioName(opcion.medio_pago_id)}</td>
                        <td>
                          <input
                            type="number"
                            value={currentMonto ?? ''}
                            onChange={(e) => handleInlineChange(
                              opcion.id, 
                              'monto_sugerido', 
                              e.target.value ? parseInt(e.target.value) : null
                            )}
                            className="admin-inline-input admin-inline-input-monto"
                            placeholder="—"
                          />
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${opcion.activo ? 'activo' : 'inactivo'}`}>
                            {opcion.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            {hasChanges ? (
                              <>
                                <button 
                                  onClick={() => handleInlineSave(opcion.id)} 
                                  disabled={loading}
                                  className="admin-btn-icon admin-btn-icon-save"
                                  title="Guardar cambios"
                                >
                                  <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleInlineCancel(opcion.id)} 
                                  className="admin-btn-icon admin-btn-icon-undo"
                                  title="Deshacer cambios"
                                >
                                  <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <button onClick={() => handleEdit(opcion)} className="admin-btn-sm">
                                Editar
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleActivo(opcion)}
                              className={`admin-btn-sm ${opcion.activo ? 'admin-btn-danger' : 'admin-btn-success'}`}
                            >
                              {opcion.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AppLayout>
  );
}
