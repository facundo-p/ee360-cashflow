// ABM de Usuarios según AUTH_AND_USERS.md
// Solo admin, sin registro público
import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layouts';
import AdminGuard from '../../components/admin/AdminGuard';
import { useAuth } from '../../contexts/AuthContext';
import type { Usuario, Rol } from '../../lib/api-unified/usuarios';
import {
  listUsuarios,
  createUsuario,
  updateUsuario,
  changePassword,
  activarUsuario,
  desactivarUsuario,
} from '../../lib/api-unified/usuarios';

type FormMode = 'create' | 'edit' | 'password' | null;

type FormData = {
  nombre: string;
  username: string;
  password: string;
  rol: Rol;
};

const emptyForm: FormData = {
  nombre: '',
  username: '',
  password: '',
  rol: 'coach',
};

export default function AdminUsuariosPage() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = async () => {
    try {
      const data = await listUsuarios();
      setUsuarios(data);
    } catch (e) {
      setError('Error al cargar usuarios');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormMode('create');
    setError('');
    setSuccess('');
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      username: usuario.username,
      password: '',
      rol: usuario.rol,
    });
    setFormMode('edit');
    setError('');
    setSuccess('');
  };

  const handleChangePassword = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setFormData({
      ...emptyForm,
      nombre: usuario.nombre,
    });
    setFormMode('password');
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setFormMode(null);
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validaciones
    if (formMode === 'create' || formMode === 'edit') {
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        return;
      }
      if (!formData.username.trim()) {
        setError('El email es requerido');
        return;
      }
      if (!validateEmail(formData.username)) {
        setError('El email no tiene formato válido');
        return;
      }
    }

    if (formMode === 'create' && (!formData.password || formData.password.length < 6)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formMode === 'password' && (!formData.password || formData.password.length < 6)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      if (formMode === 'create') {
        await createUsuario({
          nombre: formData.nombre.trim(),
          username: formData.username.toLowerCase().trim(),
          password: formData.password,
          rol: formData.rol,
        });
        setSuccess('Usuario creado exitosamente');
      } else if (formMode === 'edit' && editingId) {
        await updateUsuario(editingId, {
          nombre: formData.nombre.trim(),
          username: formData.username.toLowerCase().trim(),
          rol: formData.rol,
        });
        setSuccess('Usuario actualizado exitosamente');
      } else if (formMode === 'password' && editingId) {
        await changePassword(editingId, formData.password);
        setSuccess('Contraseña actualizada exitosamente');
      }
      await loadData();
      handleCancel();
    } catch (e) {
      const message = (e as Error).message;
      if (message.includes('DUPLICATE') || message.includes('409')) {
        setError('El email ya está en uso');
      } else {
        setError('Error: ' + message);
      }
    }
    setLoading(false);
  };

  const handleToggleActivo = async (usuario: Usuario) => {
    // No permitir desactivarse a sí mismo
    if (usuario.id === currentUser?.id) {
      setError('No puedes desactivar tu propio usuario');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      if (usuario.activo) {
        await desactivarUsuario(usuario.id);
      } else {
        await activarUsuario(usuario.id);
      }
      await loadData();
    } catch (e) {
      setError('Error al cambiar estado: ' + (e as Error).message);
    }
  };

  const getRolLabel = (rol: Rol) => {
    return rol === 'admin' ? 'Administrador' : 'Coach';
  };

  return (
    <AppLayout>
      <AdminGuard>
        <div className="admin-page-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Gestión de Usuarios</h1>
          </header>

          <div className="admin-page">
            {/* Toolbar */}
            <div className="admin-toolbar">
              <button onClick={handleNew} className="admin-btn-primary">
                + Nuevo Usuario
              </button>
            </div>

            {/* Success message */}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Error message global */}
            {error && !formMode && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            {formMode && (
              <div className="admin-form-card">
                <h3>
                  {formMode === 'create' && 'Nuevo Usuario'}
                  {formMode === 'edit' && 'Editar Usuario'}
                  {formMode === 'password' && `Cambiar Contraseña: ${formData.nombre}`}
                </h3>

                {formMode !== 'password' && (
                  <>
                    <div className="admin-form-field">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="admin-input"
                        placeholder="Nombre completo"
                        autoFocus
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>Email (username)</label>
                      <input
                        type="email"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="admin-input"
                        placeholder="usuario@ejemplo.com"
                      />
                      <small>El email se usa como credencial para iniciar sesión</small>
                    </div>

                    <div className="admin-form-field">
                      <label>Rol</label>
                      <select
                        value={formData.rol}
                        onChange={(e) => setFormData({ ...formData, rol: e.target.value as Rol })}
                        className="admin-select"
                      >
                        <option value="coach">Coach</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <small>
                        {formData.rol === 'admin' 
                          ? 'Puede gestionar usuarios, categorías, medios y opciones' 
                          : 'Solo puede registrar y ver movimientos'}
                      </small>
                    </div>
                  </>
                )}

                {(formMode === 'create' || formMode === 'password') && (
                  <div className="admin-form-field">
                    <label>{formMode === 'password' ? 'Nueva Contraseña' : 'Contraseña'}</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="admin-input"
                      placeholder="Mínimo 6 caracteres"
                      autoFocus={formMode === 'password'}
                    />
                  </div>
                )}

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

            {/* Table */}
            {loadingData ? (
              <div className="text-center py-8 text-gray-400">Cargando usuarios...</div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((usuario) => {
                        const isCurrentUser = usuario.id === currentUser?.id;
                        return (
                          <tr 
                            key={usuario.id} 
                            className={!usuario.activo ? 'admin-row-inactive' : ''}
                          >
                            <td>
                              <div className="flex items-center gap-2">
                                {usuario.nombre}
                                {isCurrentUser && (
                                  <span className="text-xs text-purple-400">(tú)</span>
                                )}
                              </div>
                            </td>
                            <td className="text-gray-400">{usuario.username}</td>
                            <td>
                              <span className={`admin-badge ${
                                usuario.rol === 'admin' 
                                  ? 'bg-purple-900/50 text-purple-300' 
                                  : 'bg-blue-900/50 text-blue-300'
                              }`}>
                                {getRolLabel(usuario.rol)}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-badge admin-badge-${usuario.activo ? 'activo' : 'inactivo'}`}>
                                {usuario.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="text-gray-500 text-sm">
                              {usuario.created_at?.slice(0, 10) ?? '-'}
                            </td>
                            <td>
                              <div className="admin-actions">
                                <button 
                                  onClick={() => handleEdit(usuario)} 
                                  className="admin-btn-sm"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => handleChangePassword(usuario)} 
                                  className="admin-btn-sm"
                                >
                                  Contraseña
                                </button>
                                <button
                                  onClick={() => handleToggleActivo(usuario)}
                                  disabled={isCurrentUser}
                                  className={`admin-btn-sm ${
                                    usuario.activo ? 'admin-btn-danger' : 'admin-btn-success'
                                  } ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title={isCurrentUser ? 'No puedes desactivar tu propio usuario' : ''}
                                >
                                  {usuario.activo ? 'Desactivar' : 'Activar'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Información</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Los usuarios con rol <strong className="text-purple-400">Administrador</strong> pueden gestionar usuarios, categorías, medios y opciones.</li>
                <li>• Los usuarios con rol <strong className="text-blue-400">Coach</strong> solo pueden registrar y ver movimientos.</li>
                <li>• Un usuario desactivado no puede iniciar sesión.</li>
                <li>• No se permite el registro público de usuarios.</li>
              </ul>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AppLayout>
  );
}
