// BottomNav: barra de navegación inferior con user menu integrado.
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { WarningConfirmModal } from './WarningConfirmModal';

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
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      
      {/* User menu integrated in bottom nav */}
      {user && (
        <button
          onClick={() => setShowConfirm(true)}
          className="nav-user-menu"
          title={`${user.nombre} - Cerrar sesión`}
        >
          <span className="nav-user-avatar">
            {getInitials(user.nombre)}
          </span>
          <span className="nav-user-label">Salir</span>
        </button>
      )}
      {showConfirm && (
        <WarningConfirmModal
          title="Cerrar sesión"
          message={
            <>
              ¿Estás seguro de que deseas cerrar sesión?
              <br />
              <strong>{user?.nombre}</strong>
            </>
          }
          confirmLabel="Cerrar sesión"
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            logout();
          }}
        />
      )}
    </nav>
  );
}
