// BottomNav: barra de navegación inferior estilo espartano.
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
    label: 'Home',
    path: '/home',
    icon: (
      <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    path: '/movimientos',
    icon: (
      <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
  },
  {
    id: 'resumen',
    label: 'Resumen',
    path: '/resumen',
    icon: (
      <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={isActive ? 'nav-button-active' : 'nav-button'}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
