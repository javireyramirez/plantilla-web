import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useState } from 'react';

import logo from '@/assets/logo.png';
import FormFieldWrapper from '@/components/auth/FormFieldWrapper.js';
import OauthButton from '@/components/auth/OauthButton.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { FieldError, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { useSignUp } from '@/hooks/use-auth.js';

import { SignUpSchema } from '@/schemas/auth.schema.js'
import { SignUpValues } from '@/schemas/auth.schema.js'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();
  const useSignUpMutation = useSignUp();

  const toggleVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
  });

  const onSubmit = (data: SignUpValues) => {
    useSignUpMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Cuenta creada correctamente');
        navigate('/home');
      },

      onError: (error) => {
        toast.error(error?.message || 'Credenciales incorrectas');
      },
    });
  };

  const isSubmitting = useSignUpMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="flex flex-col flex-wrap items-center justify-center">
            <Avatar className="size-14">
              <AvatarImage src={logo} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            Aplicación Genérica
          </CardTitle>
          <CardDescription>Aquí se hacen cosas genéricas</CardDescription>
        </CardHeader>
        <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Campo de Nombre */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormFieldWrapper fieldState={fieldState}>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                  </FormFieldWrapper>
                )}
              />

              {/* Campo de Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormFieldWrapper fieldState={fieldState}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={fieldState.invalid ? 'email-error' : undefined}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </FormFieldWrapper>
                )}
              />

              {/* Campo de Contraseña */}
              <div className="grid gap-2">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper fieldState={fieldState}>
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          className="pr-10"
                          id="password"
                          type={showPassword.password ? 'text' : 'password'}
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleVisibility('password')}
                          disabled={isSubmitting}
                          aria-label={
                            showPassword.password ? 'Ocultar contraseña' : 'Mostrar contraseña'
                          }
                        >
                          {showPassword.password ? (
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

              <Controller
                name="acceptedTerms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="acceptedTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="acceptedTerms" className="text-sm font-medium">
                        Aceptar los{' '}
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-link hover:text-link-hover hover:underline transition-colors"
                        >
                          términos y condiciones
                        </Button>
                        *
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
                  Iniciando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            {/* Botones OAuth */}
            <OauthButton isSubmitting={isSubmitting} />

            {/* Link de Inicio */}
            <Button
              variant="link"
              className="h-auto p-0 text-link hover:text-link-hover hover:underline transition-colors"
              asChild
            >
              <Link to="/signin" tabIndex={isSubmitting ? -1 : 0}>
                ¿Ya tienes cuenta?
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
