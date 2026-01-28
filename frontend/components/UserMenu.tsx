// Componente UserMenu según AUTH_AND_USERS.md sección 4.2
// Muestra: ícono de usuario, nombre, opción de logout
// Funciona en mobile y desktop

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  className?: string;
  variant?: 'mobile' | 'desktop';
};

export default function UserMenu({ className = '', variant = 'desktop' }: Props) {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const rolLabel = isAdmin ? 'Administrador' : 'Coach';
  const rolBadgeClass = isAdmin 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-blue-100 text-blue-700';

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Botón de usuario */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg transition-colors
          ${variant === 'mobile' 
            ? 'p-2 hover:bg-gray-100' 
            : 'px-3 py-2 hover:bg-gray-100'
          }
        `}
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        {/* Ícono de usuario */}
        <div className={`
          flex items-center justify-center rounded-full bg-primary text-white font-medium
          ${variant === 'mobile' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'}
        `}>
          {user.nombre.charAt(0).toUpperCase()}
        </div>
        
        {/* Nombre (solo desktop) */}
        {variant === 'desktop' && (
          <span className="text-sm font-medium text-gray-700 hidden lg:block">
            {user.nombre}
          </span>
        )}
        
        {/* Chevron */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`
          absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-gray-200
          ${variant === 'mobile' ? 'right-0 w-64' : 'right-0 w-72'}
        `}>
          {/* Info del usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
            <p className="text-xs text-gray-500 truncate">{user.username}</p>
            <span className={`
              inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full
              ${rolBadgeClass}
            `}>
              {rolLabel}
            </span>
          </div>

          {/* Opciones */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="
                w-full px-4 py-2 text-left text-sm text-gray-700 
                hover:bg-gray-50 flex items-center gap-2
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
