// AdminGuard: protege rutas admin, redirige si no es admin
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionMock } from '../../hooks/useSessionMock';
import { useIsDesktop } from '../../hooks/useMediaQuery';

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const { user } = useSessionMock();
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChecking) return;
    
    // Redirect if not admin
    if (!user || user.rol !== 'admin') {
      router.replace('/home');
      return;
    }
    
    // Redirect to home if on mobile (admin only available on desktop)
    if (!isDesktop) {
      router.replace('/home');
      return;
    }
  }, [user, isDesktop, router, isChecking]);

  if (isChecking) {
    return (
      <div className="admin-loading">
        <p>Verificando acceso...</p>
      </div>
    );
  }

  if (!user || user.rol !== 'admin' || !isDesktop) {
    return null;
  }

  return <>{children}</>;
}
