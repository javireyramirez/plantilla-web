import { LoaderCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PropsWithChildren, useEffect, useRef } from 'react';

import { useSession } from '@/config/auth-client.js';

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

function ProtectedRoute({ children, redirectTo = '/signin' }: ProtectedRouteProps) {
  const { data: session, isPending, error } = useSession();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if ((error || !session) && !isPending && !hasShownToast.current) {
      if (error) {
        console.error('Error de autenticación:', error);
        toast.error('Error al verificar la sesión');
      } else {
        toast.info('Debes iniciar sesión para acceder');
      }
      hasShownToast.current = true;
    }
  }, [error, session, isPending]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-label="Cargando" />
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
