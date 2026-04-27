import { LoaderCircle } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { PropsWithChildren } from 'react';

import { useSession } from '@/config/auth-client.js';
import { isSigningOut } from '@/lib/auth-flags.js';

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

function ProtectedRoute({ redirectTo = '/signin' }: ProtectedRouteProps) {
  const { data: session, isPending, error, isRefetching } = useSession();
  const location = useLocation();

  // Mostrar loader durante CUALQUIER estado de carga (inicial o refetch)
  // O si el session es undefined (aún no se ha intentado cargar)
  if (isPending || isRefetching || (session === undefined && !error)) {
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
    // Durante sign-out voluntario: redirigir inmediatamente sin pasar 'reason'
    // para evitar el toast de "no autorizado".
    if (isSigningOut()) {
      return <Navigate to={redirectTo} replace />;
    }
    const reason = error ? 'error' : 'unauthorized';
    // Pasar la ruta actual para que GuestRoute redirija aquí tras el login
    return <Navigate to={redirectTo} replace state={{ reason, from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
