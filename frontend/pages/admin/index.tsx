// Admin Dashboard: panel principal de administración
import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layouts';
import AdminGuard from '../../components/admin/AdminGuard';
import { listCategorias } from '../../lib/api-mock/categorias';
import { listMedios } from '../../lib/api-mock/medios';
import { listOpciones } from '../../lib/api-mock/opciones';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categorias: { total: 0, activas: 0 },
    medios: { total: 0, activos: 0 },
    opciones: { total: 0, activas: 0 },
  });

  useEffect(() => {
    Promise.all([
      listCategorias(),
      listMedios(),
      listOpciones(),
    ]).then(([cats, meds, opts]) => {
      setStats({
        categorias: { total: cats.length, activas: cats.filter((c) => c.activo).length },
        medios: { total: meds.length, activos: meds.filter((m) => m.activo).length },
        opciones: { total: opts.length, activas: opts.filter((o) => o.activo).length },
      });
    });
  }, []);

  return (
    <AppLayout>
      <AdminGuard>
        <div className="admin-page-content">
          <header className="admin-page-header">
            <h1 className="admin-page-title">Panel de Administración</h1>
          </header>

          <div className="admin-dashboard">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Categorías</h3>
                <p className="admin-stat-value">{stats.categorias.activas}</p>
                <p className="admin-stat-label">de {stats.categorias.total} activas</p>
              </div>
              
              <div className="admin-stat-card">
                <h3>Medios de Pago</h3>
                <p className="admin-stat-value">{stats.medios.activos}</p>
                <p className="admin-stat-label">de {stats.medios.total} activos</p>
              </div>
              
              <div className="admin-stat-card">
                <h3>Opciones</h3>
                <p className="admin-stat-value">{stats.opciones.activas}</p>
                <p className="admin-stat-label">de {stats.opciones.total} activas</p>
              </div>
            </div>

            <div className="admin-info-section">
              <h3>Información</h3>
              <p>
                Desde este panel puedes gestionar las categorías de movimiento, 
                los medios de pago disponibles, y las opciones que aparecen en 
                la botonera principal de la aplicación.
              </p>
              <ul>
                <li><strong>Categorías:</strong> Tipos base de movimiento (Plan mensual, Bebida, etc.)</li>
                <li><strong>Medios de Pago:</strong> Formas de pago aceptadas (Efectivo, Transferencia, etc.)</li>
                <li><strong>Opciones:</strong> Combinaciones de categoría + medio + precio que ve el usuario</li>
              </ul>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AppLayout>
  );
}
