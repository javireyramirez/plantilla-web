import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle, Mail } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useState } from 'react';

import FormFieldWrapper from '@/components/auth/FormFieldWrapper.js';
import { Button } from '@/components/ui/button.js';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { FieldError, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Separator } from '@/components/ui/separator.js';
import { useSession } from '@/config/auth-client.js';
import { useChangePassword, useSendVerificationEmail } from '@/hooks/use-auth.js';
import { ChangePasswordSchema } from '@/schemas/auth.schema.js';
import { ChangePasswordSchemaValues } from '@/schemas/auth.schema.js';

export default function Profile() {
  const { data: session } = useSession();
  const isVerified = session?.user?.emailVerified;
  const toggleVisibility = (field: 'newPassword' | 'confirmPassword' | 'currentPassword') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const useChangePasswordMutation = useChangePassword();
  const {
    mutate: sendEmail,
    isPending: isPendingMail,
    isSuccess: isSuccessMail,
  } = useSendVerificationEmail();

  const form = useForm<ChangePasswordSchemaValues>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: false,
    },
  });

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-label="Cargando" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ChangePasswordSchemaValues) => {
    useChangePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Contraseña cambiada correctamente');
      },

      onError: (error) => {
        toast.error(error?.message || 'Fallo al cambiar la contraseña');
      },
    });
  };

  const isSubmitting = useChangePasswordMutation.isPending;

  const handleVerificationEmail = () => {
    if (!session?.user?.email) {
      toast.error('No se encontró un correo asociado');
      return;
    }

    sendEmail(
      { email: session.user.email },
      {
        onSuccess: () => toast.success('Email de verificación enviado'),
        onError: (error) => toast.error(error?.message || 'Error al enviar'),
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center">
      <div className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="flex flex-col flex-wrap items-center justify-center mb-4">
            Verificación email
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full h-10"
            onClick={handleVerificationEmail}
            disabled={isPendingMail || isVerified || isSuccessMail}
          >
            {isVerified ? (
              'Email verificado'
            ) : isPendingMail ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : isSuccessMail ? (
              'Enviado correctamente'
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="size-4" />
                Enviar link de verificación
              </span>
            )}
          </Button>

          {!isVerified && isSuccessMail && (
            <p className="text-xs text-muted-foreground text-center animate-in fade-in">
              Revisa tu bandeja de entrada o spam.
            </p>
          )}
        </CardFooter>
      </div>
      <div className="w-full max-w-sm">
        <Separator />
      </div>
      <div className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="flex flex-col flex-wrap items-center justify-center mb-4">
            Cambio de contraseña
          </CardTitle>
        </CardHeader>
        <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Campo de Antigua Contraseña */}
              <div className="grid gap-2">
                <Controller
                  name="currentPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper fieldState={fieldState}>
                      <FieldLabel htmlFor="currentPassword">Contraseña Actual</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="pr-10"
                          id="currentPassword"
                          type={showPassword.currentPassword ? 'text' : 'password'}
                          aria-invalid={fieldState.invalid}
                          autoComplete="current-password"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleVisibility('currentPassword')}
                          disabled={isSubmitting}
                          aria-label={
                            showPassword.currentPassword
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                        >
                          {showPassword.currentPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Campo de Nueva Contraseña */}
              <div className="grid gap-2">
                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper fieldState={fieldState}>
                      <FieldLabel htmlFor="newPassword">Nueva Contraseña</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="pr-10"
                          id="newPassword"
                          type={showPassword.newPassword ? 'text' : 'password'}
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleVisibility('newPassword')}
                          disabled={isSubmitting}
                          aria-label={
                            showPassword.newPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                          }
                        >
                          {showPassword.newPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Campo de Repetir Contraseña */}
              <div className="grid gap-2">
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper fieldState={fieldState}>
                      <FieldLabel htmlFor="confirmPassword">Repetir Contraseña</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="pr-10"
                          id="confirmPassword"
                          type={showPassword.confirmPassword ? 'text' : 'password'}
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleVisibility('confirmPassword')}
                          disabled={isSubmitting}
                          aria-label={
                            showPassword.confirmPassword
                              ? 'Ocultar contraseña'
                              : 'Mostrar contraseña'
                          }
                        >
                          {showPassword.confirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Campo revocar otras sesiones */}
              <Controller
                name="revokeOtherSessions"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="revokeOtherSessions"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="revokeOtherSessions" className="text-sm font-medium">
                        Eliminar sesiones en el resto de dispositivos
                      </label>
                    </div>
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                  </div>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-4">
            {/* Botón de Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
}
