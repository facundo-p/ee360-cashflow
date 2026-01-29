// MobileLayout: layout móvil con BottomNav (incluye user menu)
import React from 'react';
import BottomNav from '../BottomNav';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
  containerClass?: string;
  showNav?: boolean;
};

export default function MobileLayout({ 
  children, 
  containerClass = 'page-container',
  showNav = true,
}: Props) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={containerClass}>
      {/* Content - takes full height minus bottom nav */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Bottom navigation with integrated user menu */}
      {showNav && isAuthenticated && <BottomNav />}
    </div>
  );
}
