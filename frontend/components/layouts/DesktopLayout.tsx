// DesktopLayout: layout de escritorio con dashboard y sidebar de navegación
import React from 'react';
import { useRouter } from 'next/router';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
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
    id: 'list',
    label: 'Movimientos',
    path: '/movimientos',
    icon: (
      <svg className="desktop-nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
  },
];

type Props = {
  children: React.ReactNode;
};

export default function DesktopLayout({ children }: Props) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="desktop-layout">
      {/* Sidebar */}
      <aside className="desktop-sidebar">
        <div className="desktop-sidebar-header">
          <h1 className="desktop-logo">Cashflow</h1>
          <span className="desktop-logo-sub">EE360</span>
        </div>
        
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={isActive ? 'desktop-nav-item-active' : 'desktop-nav-item'}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="desktop-sidebar-footer">
          <span className="desktop-version">v1.0.0</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="desktop-main">
        {children}
      </main>
    </div>
  );
}
