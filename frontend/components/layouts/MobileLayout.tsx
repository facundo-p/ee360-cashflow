// MobileLayout: layout móvil con header y BottomNav
// Según AUTH_AND_USERS.md sección 4.2: ícono de usuario en esquina superior derecha
import React from 'react';
import BottomNav from '../BottomNav';
import UserMenu from '../UserMenu';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
  containerClass?: string;
  showNav?: boolean;
  title?: string;
};

export default function MobileLayout({ 
  children, 
  containerClass = 'page-container',
  showNav = true,
  title,
}: Props) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={containerClass}>
      {/* Header con UserMenu */}
      {isAuthenticated && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">
              {title || 'Cashflow'}
            </span>
          </div>
          <UserMenu variant="mobile" />
        </header>
      )}

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Bottom navigation */}
      {showNav && isAuthenticated && (
        <>
          <div className="page-divider" />
          <BottomNav />
        </>
      )}
    </div>
  );
}
