// AppLayout: componente que alterna entre layout móvil y desktop
import React from 'react';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

type Props = {
  children: React.ReactNode;
  mobileContainerClass?: string;
  showMobileNav?: boolean;
};

export default function AppLayout({ 
  children, 
  mobileContainerClass = 'page-container',
  showMobileNav = true 
}: Props) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>;
  }

  return (
    <MobileLayout 
      containerClass={mobileContainerClass}
      showNav={showMobileNav}
    >
      {children}
    </MobileLayout>
  );
}
