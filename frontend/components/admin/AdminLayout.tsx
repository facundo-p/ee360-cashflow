// AdminLayout: layout específico para páginas de administración
import React from 'react';
import { useRouter } from 'next/router';
import AdminGuard from './AdminGuard';

type NavItem = {
  id: string;
  label: string;
  path: string;
};

const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin' },
  { id: 'categorias', label: 'Categorías', path: '/admin/categorias' },
  { id: 'medios', label: 'Medios de Pago', path: '/admin/medios' },
  { id: 'opciones', label: 'Opciones', path: '/admin/opciones' },
];

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function AdminLayout({ children, title }: Props) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <AdminGuard>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h1 className="admin-logo">Admin</h1>
            <span className="admin-logo-sub">Configuración</span>
          </div>
          
          <nav className="admin-nav">
            {adminNavItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={isActive ? 'admin-nav-item-active' : 'admin-nav-item'}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              onClick={() => router.push('/home')}
              className="admin-back-btn"
            >
              ← Volver a la App
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          <header className="admin-header">
            <h1 className="admin-title">{title}</h1>
          </header>
          <div className="admin-content">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
