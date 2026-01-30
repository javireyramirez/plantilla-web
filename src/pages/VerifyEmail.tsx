import { CheckCircle, LoaderCircle, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { useVerifyEmail } from '@/hooks/use-auth.js';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [countdown, setCountdown] = useState(3);
  const { mutate, isPending } = useVerifyEmail();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    const data = { token };

    mutate(data, {
      onSuccess: async () => {
        setStatus('success');
      },
      onError: (error) => {
        console.error('Error verificando:', error.message);
        setStatus('error');
      },
    });
  }, [searchParams, navigate]);

  useEffect(() => {
    if (status !== 'success') {
      return;
    }

    if (countdown <= 0) {
      toast.success('Email verificado correctamente');
      navigate('/home');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate, status]);

  if (status === 'loading' || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-col items-center justify-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={logo} alt="Logo de la aplicación" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2">
              <XCircle className="size-10 text-destructive" />
              <CardTitle className="text-center">Error en la verificación</CardTitle>
            </div>

            <CardDescription className="text-center">
              El enlace es inválido, ha expirado o ya ha sido utilizado.
            </CardDescription>

            <Button className="w-full mt-2" onClick={() => navigate('/login')}>
              Volver a inicio de sesión
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src={logo} alt="Logo de la aplicación" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="size-10 text-success" />
            <CardTitle className="text-center">Tu cuenta ha sido confirmada con éxito.</CardTitle>
          </div>

          <CardDescription className="text-center">
            Redirigiendo al dashboard en {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </CardDescription>

          <Button className="w-full mt-2" onClick={() => navigate('/home')}>
            Ir ahora
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
