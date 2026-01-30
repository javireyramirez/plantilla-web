import { LoaderCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PropsWithChildren, useEffect, useRef } from 'react';

import { useSession } from '@/config/auth-client.js';

interface GuestRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

function GuestRoute({ children, redirectTo = '/home' }: GuestRouteProps) {
  const { data: session, isPending, error } = useSession();
  const toastShown = useRef(false);

  useEffect(() => {
    if (session && !toastShown.current) {
      toast.info('Sesión iniciada correctamente');
      toastShown.current = true;
    }
  }, [session]);

  if (error) {
    console.error('Error verificando sesión:', error);
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;
