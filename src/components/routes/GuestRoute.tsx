import { LoaderCircle } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';

import { PropsWithChildren } from 'react';

import { useSession } from '@/config/auth-client.js';

interface GuestRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

function GuestRoute({ children, redirectTo = '/home' }: GuestRouteProps) {
  const { data: session, isPending, error, isRefetching } = useSession();
  const location = useLocation();

  if (error) {
    console.error('Error verificando sesión:', error);
    return <>{children}</>;
  }

  // Mostrar loader durante CUALQUIER estado de carga (inicial o refetch)
  // O si el session es undefined (aún no se ha intentado cargar)
  if (isPending || isRefetching || (session === undefined && !error)) {
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
    // Redirigir a la ruta original si existe (ej. usuario recargó /pagina1 sin sesión)
    const destination = location.state?.from || redirectTo;
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;

