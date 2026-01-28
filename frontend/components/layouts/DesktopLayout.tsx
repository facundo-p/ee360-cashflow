// DesktopLayout: layout de escritorio con sidebar y header
// Según AUTH_AND_USERS.md sección 4.2: ícono de usuario en esquina superior derecha
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../UserMenu';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
  children?: { id: string; label: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    path: '/home',
    icon: (
      <svg className="desktop-nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: 'movimientos',
    label: 'Movimientos',
    path: '/movimientos',
    icon: (
      <svg className="desktop-nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    adminOnly: true,
    icon: (
      <svg className="desktop-nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
    children: [
      { id: 'admin-categorias', label: 'Categorías', path: '/admin/categorias' },
      { id: 'admin-medios', label: 'Medios de Pago', path: '/admin/medios' },
      { id: 'admin-opciones', label: 'Opciones', path: '/admin/opciones' },
      { id: 'admin-usuarios', label: 'Usuarios', path: '/admin/usuarios' },
    ],
  },
];

type Props = {
  children: React.ReactNode;
};

export default function DesktopLayout({ children }: Props) {
  const router = useRouter();
  const currentPath = router.pathname;
  const { user, isAdmin, isAuthenticated } = useAuth();
  
  // Auto-expand admin if on admin route
  const [adminExpanded, setAdminExpanded] = useState(currentPath.startsWith('/admin'));

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      setAdminExpanded((prev) => !prev);
      return;
    }
  
    router.push(item.path);
  };

  const isItemActive = (item: NavItem) => {
    if (item.children) {
      return currentPath.startsWith(item.path);
    }
    return currentPath === item.path;
  };

  return (
    <div className="desktop-layout">
      {/* Sidebar */}
      <aside className="desktop-sidebar">
        <div className="desktop-sidebar-header">
          <h1 className="desktop-logo">Cashflow</h1>
          <span className="desktop-logo-sub">EE360</span>
        </div>
        
        <nav className="desktop-nav">
          {visibleNavItems.map((item) => {
            const isActive = isItemActive(item);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={isActive ? 'desktop-nav-item-active' : 'desktop-nav-item'}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {hasChildren && (
                    <svg 
                      className={`desktop-nav-chevron ${adminExpanded ? 'desktop-nav-chevron-open' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  )}
                </button>
                
                {/* Nested items */}
                {hasChildren && adminExpanded && (
                  <div className="desktop-nav-children">
                    {item.children!.map((child) => {
                      const isChildActive = currentPath === child.path;
                      return (
                        <button
                          key={child.id}
                          onClick={() => router.push(child.path)}
                          className={isChildActive ? 'desktop-nav-child-active' : 'desktop-nav-child'}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="desktop-sidebar-footer">
          <span className="desktop-version">v1.0.0</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="desktop-main-wrapper">
        {/* Header with UserMenu */}
        {isAuthenticated && (
          <header className="desktop-header">
            <div className="flex-1" />
            <UserMenu variant="desktop" />
          </header>
        )}
        
        <main className="desktop-main">
          {children}
        </main>
      </div>
    </div>
  );
}
