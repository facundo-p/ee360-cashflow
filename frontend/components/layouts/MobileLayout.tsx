// MobileLayout: layout móvil con BottomNav para navegación
import React from 'react';
import BottomNav from '../BottomNav';

type Props = {
  children: React.ReactNode;
  containerClass?: string;
  showNav?: boolean;
};

export default function MobileLayout({ 
  children, 
  containerClass = 'page-container',
  showNav = true 
}: Props) {
  return (
    <div className={containerClass}>
      {children}
      {showNav && (
        <>
          <div className="page-divider" />
          <BottomNav />
        </>
      )}
    </div>
  );
}
