import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, ChevronDown, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { DocumentsTable } from '@/components/storage-table/storage-table';
import { FileUploadButton } from '@/components/storage/FileUploadButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
  // --- Configuración de Tabs ---

  // --- Estados locales ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shouldCloseOnSubmit, setShouldCloseOnSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

  // --- Hooks de datos y formulario ---
  const { id } = useParams<{ id: string }>();
  const { isEditing, defaultValues, isLoading, isFetching, handleSubmit, handleDelete, isPending } =
    useCompanyForm(id);

  const form = useForm<CreateCompany>({
    resolver: zodResolver(CreateCompanyBodySchema),
    mode: 'onBlur',
    defaultValues: defaultValues ?? { name: '', nif: '', sector: '' },
  });

  const tabs = [
    { value: 'detail', label: 'Detalle', viewAtCreate: true },
    { value: 'docs', label: 'Documentación', viewAtCreate: isEditing },
    { value: 'audit', label: 'Auditoría', viewAtCreate: isEditing },
  ];

  const currentTab = tabs.find((tab) => tab.value === activeTab);

  // --- Sincronización del formulario con el backend ---
  useEffect(() => {
    if (isEditing) {
      if (!isLoading && !isFetching && defaultValues) {
        form.reset(defaultValues);
      }
    } else {
      form.reset({ name: '', nif: '', sector: '' });
    }
  }, [isEditing, defaultValues, isLoading, isFetching, form]);

  const companyName = useWatch({ control: form.control, name: 'name' });

  // --- Estado de Carga (Skeletons) ---
  if (isLoading) {
    return (
      <div className="space-y-6 mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

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

        <div className="border-b pb-2 flex gap-6">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>

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

  // --- Renderizado Principal ---
  return (
    <div className="space-y-6 mx-auto p-4 md:p-6">
      {/* SECCIÓN: Breadcrumb */}
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

      {/* SECCIÓN: Barra de Acciones Adaptativa Global */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
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

        {/* Contenedor Único de Botones (Control de responsividad fluido) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Acción Principal: Siempre visible */}
          <Button
            form="company-form-id"
            type="submit"
            disabled={isPending}
            onClick={() => setShouldCloseOnSubmit(false)}
            className="gap-2 shadow-sm flex-1 sm:flex-none justify-center"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>

          {/* Botón Guardar y Cerrar: Visible a partir de pantallas medianas (md) */}
          <Button
            form="company-form-id"
            type="submit"
            variant="outline"
            disabled={isPending}
            onClick={() => setShouldCloseOnSubmit(true)}
            className="hidden md:flex gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar y cerrar
          </Button>

          {isEditing && (
            <>
              {/* Exportar y Eliminar: Visibles a partir de pantallas grandes (lg) */}
              <Button
                type="button"
                variant="outline"
                className="hidden lg:flex gap-2"
                disabled={isPending}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="hidden lg:flex border-destructive text-destructive hover:bg-destructive hover:text-white gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>

              {/* Nueva Compañía: Visible solo en pantallas muy grandes (xl) */}
              <Button
                type="button"
                variant="outline"
                className="hidden xl:flex gap-2"
                disabled={isPending}
                asChild
              >
                <Link to="/companies/new">
                  <Download className="h-4 w-4" />
                  Nueva compañía
                </Link>
              </Button>
            </>
          )}

          {/* Menú Desplegable Adaptativo: Captura los botones que desaparecen según el breakpoint */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`px-3 ${isEditing ? 'xl:hidden' : 'md:hidden'}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {/* Se muestra en el menú si la pantalla es menor a md */}
              <DropdownMenuItem
                disabled={isPending}
                className="md:hidden gap-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setShouldCloseOnSubmit(true);
                  form.handleSubmit((data) => handleSubmit(data, { shouldClose: true }))();
                }}
              >
                <Save className="h-4 w-4" />
                Guardar y cerrar
              </DropdownMenuItem>

              {isEditing && (
                <>
                  {/* Se muestra en el menú si la pantalla es menor a lg */}
                  <DropdownMenuItem disabled={isPending} className="lg:hidden gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </DropdownMenuItem>

                  {/* Se muestra en el menú si la pantalla es menor a xl */}
                  <DropdownMenuItem disabled={isPending} className="xl:hidden gap-2" asChild>
                    <Link to="/companies/new">
                      <Download className="h-4 w-4" />
                      Nueva compañía
                    </Link>
                  </DropdownMenuItem>

                  {/* Se muestra en el menú si la pantalla es menor a lg */}
                  <DropdownMenuItem
                    disabled={isPending}
                    className="lg:hidden gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(e) => {
                      e.preventDefault();
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* SECCIÓN: Navegación por Pestañas (Tabs) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        {/* Vista Escritorio */}
        <TabsList
          variant="line"
          className="hidden md:flex h-auto w-fit justify-start gap-6 rounded-none border-b bg-transparent p-0"
        >
          {tabs
            .filter((t) => t.viewAtCreate === true)
            .map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-0 w-32 shrink-0">
                {tab.label}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* Vista Móvil */}
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

        {/* CONTENIDO DE LAS PESTAÑAS */}
        <TabsContent value="detail" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Formulario de Datos Básicos */}
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

            {/* Tarjetas Secundarias Estatales */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Información Adicional</CardTitle>
                <CardDescription>Sección pendiente de definir.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.
              </CardContent>
            </Card>

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

        {isEditing && (
          <>
            <TabsContent
              value="docs"
              className="p-4 border rounded-xl bg-card text-muted-foreground text-sm flex flex-col gap-6"
            >
              <div className="flex justify-end">
                <FileUploadButton entityType="companies" entityId={id!} multiple={true} />
              </div>

              <DocumentsTable entityType="companies" entityId={id!} />
            </TabsContent>

            <TabsContent
              value="audit"
              className="p-4 border rounded-xl bg-card text-muted-foreground text-sm"
            >
              Aquí va la auditoría...
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* SECCIÓN: Diálogo de Confirmación de Borrado Único (Centralizado) */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta compañía?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La compañía será eliminada permanentemente del
              sistema.
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
    </div>
  );
}
