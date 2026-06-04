import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, ChevronDown, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyForm } from '@/modules/companies/use-companies-form';

import { CreateCompany, CreateCompanyBodySchema } from '../companies.schema';
import { SECTOR_OPTIONS } from '../companies.types';

export default function CompanyForm() {
  const tabs = [
    { value: 'detail', label: 'Detalle' },
    { value: 'docs', label: 'Documentación' },
    { value: 'audit', label: 'Auditoría' },
  ];

  const [shouldCloseOnSubmit, setShouldCloseOnSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

  const currentTab = tabs.find((tab) => tab.value === activeTab);

  const { id } = useParams<{ id: string }>();
  const { isEditing, defaultValues, isLoading, isFetching, handleSubmit, handleDelete, isPending } =
    useCompanyForm(id);

  const form = useForm<CreateCompany>({
    resolver: zodResolver(CreateCompanyBodySchema),
    mode: 'onBlur',
    defaultValues: defaultValues ?? { name: '', nif: '', sector: '' },
  });

  useEffect(() => {
    if (isEditing) {
      if (!isLoading && !isFetching && defaultValues) {
        form.reset(defaultValues);
      }
    } else {
      form.reset({
        name: '',
        nif: '',
        sector: '',
      });
    }
  }, [isEditing, defaultValues, isLoading, isFetching, form]);

  const companyName = useWatch({ control: form.control, name: 'name' });

  if (isLoading) {
    return (
      <div className="space-y-6 mx-auto p-4 md:p-6">
        {/* Skeleton Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Skeleton Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64 hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 flex-1 sm:flex-none sm:w-28" />
            <Skeleton className="h-10 w-10 sm:w-24 hidden sm:block" />
            <Skeleton className="h-10 w-10 sm:w-24 hidden sm:block" />
          </div>
        </div>

        {/* Skeleton Tabs Navigation */}
        <div className="border-b pb-2 flex gap-6">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Skeleton Cards Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6  mx-auto p-4 md:p-6">
      {/* BREADCRUMB */}
      {/* BREADCRUMB CORREGIDO */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="transition-colors hover:text-foreground">
              <Link to="/companies">Compañías</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {isEditing ? `${companyName}` : 'Crear nueva compañía'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* BARRA DE ACCIONES PRINCIPAL */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
        {/* Bloque del Título */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {isEditing ? (
              <span className="truncate">
                <span className="text-primary">{companyName}</span>
              </span>
            ) : (
              'Crear nueva compañía'
            )}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {isEditing
              ? 'Datos de la empresa en el sistema.'
              : 'Introduce los datos para registrar la empresa.'}
          </p>
        </div>

        {/* Contenedor de Botones Adaptativo */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Botón Guardar: Prioritario e independiente */}
          <Button
            form="company-form-id"
            type="submit"
            variant="outline"
            disabled={isPending}
            onClick={() => setShouldCloseOnSubmit(true)}
            className="gap-2 shadow-sm flex-1 sm:flex-none justify-center order-2 sm:order-2"
          >
            <Save className="h-4 w-4" />
            Guardar y cerrar
          </Button>
          <Button
            form="company-form-id"
            disabled={isPending}
            onClick={() => setShouldCloseOnSubmit(false)}
            size="default"
            className="gap-2 shadow-sm flex-1 sm:flex-none sm:size-sm justify-center order-1 sm:order-3"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>

          {/* Vista Escritorio: Botones secundarios directos */}
          <div className="hidden sm:flex items-center gap-2 order-1">
            {isEditing && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isPending}
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar esta compañía?</AlertDialogTitle>

                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La compañía será eliminada del sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>

                      <AlertDialogAction onClick={handleDelete} variant="destructive">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isPending}
                >
                  <Link to="/companies/new" className="flex flex-row gap-2 items-center">
                    <Download className="h-4 w-4" />
                    Nueva compañía
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Vista Móvil: Acciones secundarias en menú desplegable */}
          {isEditing && (
            <div className="sm:hidden order-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="px-3">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    Exportar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN RESPONSIVE */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        {' '}
        {/* DESKTOP */}
        <TabsList
          variant="line"
          className="hidden md:flex h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0"
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-0">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* MOBILE */}
        <div className="border-b md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 px-0 text-base font-medium">
                {currentTab?.label}

                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64">
              {tabs.map((tab) => (
                <DropdownMenuItem key={tab.value} onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* CONTENIDO DE LOS TABS */}
        <TabsContent value="detail" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Card 1: Formulario */}
            <Card className="lg:col-span-1 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Datos básicos</CardTitle>
                <CardDescription>Información principal de identificación.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  id="company-form-id"
                  onSubmit={form.handleSubmit((data) =>
                    handleSubmit(data, { shouldClose: shouldCloseOnSubmit })
                  )}
                  className="space-y-4"
                >
                  <FieldGroup className="space-y-4">
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="company-name"
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            Compañía
                          </FieldLabel>
                          <Input
                            {...field}
                            id="company-name"
                            aria-invalid={fieldState.invalid}
                            placeholder="Nombre de la empresa"
                            autoComplete="off"
                            className="mt-1.5 focus-visible:ring-primary"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="nif"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="company-nif"
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            CIF / NIF
                          </FieldLabel>
                          <Input
                            {...field}
                            id="company-nif"
                            aria-invalid={fieldState.invalid}
                            placeholder="A1234567B"
                            autoComplete="off"
                            className="mt-1.5 focus-visible:ring-primary"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="sector"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="company-sector"
                            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            Sector
                          </FieldLabel>
                          <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                            <SelectTrigger
                              id="company-sector"
                              className="mt-1.5 focus-visible:ring-primary w-full"
                              aria-invalid={fieldState.invalid}
                            >
                              <SelectValue placeholder="Selecciona un sector" />
                            </SelectTrigger>

                            <SelectContent>
                              {SECTOR_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Información Adicional</CardTitle>
                <CardDescription>Sección pendiente de definir.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Métricas / Resumen</CardTitle>
                <CardDescription>Datos estadísticos de la entidad.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget elit nec.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent
          value="docs"
          className="p-4 border rounded-xl bg-card text-muted-foreground text-sm"
        >
          Aquí van los documentos...
        </TabsContent>
        <TabsContent
          value="audit"
          className="p-4 border rounded-xl bg-card text-muted-foreground text-sm"
        >
          Aquí va la auditoría...
        </TabsContent>
      </Tabs>
    </div>
  );
}
