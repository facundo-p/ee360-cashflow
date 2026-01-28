// AdminGuard: protege rutas admin según AUTH_AND_USERS.md
// Redirige si no es admin o si está en mobile
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useIsDesktop } from '../../hooks/useMediaQuery';

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;            // ⬅️ esperar
    if (isAdmin === undefined) return;
    if (isDesktop === undefined) return;
    
    // Redirect if not authenticated or not admin
    if (!user || !isAdmin) {
      router.replace('/home');
      return;
    }
    
    // Admin only available on desktop
    if (!isDesktop) {
      router.replace('/home');
      return;
    }
  }, [user, isAdmin, isDesktop, router, isLoading]);

  // Loading state
  if (isLoading || isDesktop === undefined || isAdmin === undefined) {
    return (
      <div className="admin-loading">
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Not authorized
  if (!user || !isAdmin || !isDesktop) {
    return null;
  }

  return <>{children}</>;
}
