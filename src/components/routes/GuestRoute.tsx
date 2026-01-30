import { LoaderCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PropsWithChildren } from 'react';

import { useSession } from '@/config/auth-client.js';

interface GuestRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

function GuestRoute({ children, redirectTo = '/home' }: GuestRouteProps) {
  const { data: session, isPending, isRefetching, error } = useSession();

  if (error) {
    console.error('Error verificando sesión:', error);
    return <>{children}</>;
  }

  if (isPending && !isRefetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-label="Cargando" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (session) {
    toast.info('Sesión iniciada correctamente');
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;
