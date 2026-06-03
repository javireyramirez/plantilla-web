import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

import { CreateCompany, CreateCompanyBodySchema } from '../companies.schema';

export default function CompanyForm() {
  const isMobile = useIsMobile();

  const form = useForm<CreateCompany>({
    resolver: zodResolver(CreateCompanyBodySchema),
    mode: 'onBlur',
    defaultValues: { name: '', nif: '', sector: '' },
  });

  const companyName = useWatch({ control: form.control, name: 'name' });

  const onSubmit = (data: CreateCompany) => console.log(data);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/companies" className="transition-colors hover:text-foreground">
              Compañías
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">
              {companyName ? `Editar: ${companyName}` : 'Nueva compañía'}
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
            {companyName ? (
              <span className="truncate">
                Editar <span className="text-primary">{companyName}</span>
              </span>
            ) : (
              'Crear nueva compañía'
            )}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {companyName
              ? 'Modifica los datos de la empresa en el sistema.'
              : 'Introduce los datos para registrar la empresa.'}
          </p>
        </div>

        {/* Contenedor de Botones Adaptativo */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Botón Guardar: Prioritario e independiente */}
          <Button
            type="submit"
            form="company-form-id"
            size="default"
            className="gap-2 shadow-sm flex-1 sm:flex-none sm:size-sm justify-center order-1 sm:order-3"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>

          {/* Vista Escritorio: Botones secundarios directos */}
          <div className="hidden sm:flex items-center gap-2 order-1">
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>

          {/* Vista Móvil: Acciones secundarias en menú desplegable */}
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
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN RESPONSIVE */}
      <Tabs defaultValue="detalle" className="w-full space-y-6">
        <div className="border-b border-border w-full flex items-center justify-between">
          {/* 1. Vista Escritorio: Todas las pestañas a tamaño fijo (sm:w-32) */}
          <TabsList
            className="hidden sm:flex h-auto w-max justify-start rounded-none bg-transparent p-0 space-x-6"
            variant="line"
          >
            <TabsTrigger className="sm:w-32" value="detalle">
              Detalle
            </TabsTrigger>
            <TabsTrigger className="sm:w-32" value="docs">
              Documentación
            </TabsTrigger>
            <TabsTrigger className="sm:w-32" value="audit">
              Auditoría
            </TabsTrigger>
          </TabsList>

          {/* 2. Vista Móvil: Pestaña principal + Desplegable de tres puntos */}
          <TabsList
            className="flex sm:hidden h-auto w-full justify-between rounded-none bg-transparent p-0"
            variant="line"
          >
            <TabsTrigger className="flex-1 justify-start px-2" value="detalle">
              Detalle
            </TabsTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-none border-b-2 border-transparent px-3 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=open]:border-primary"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Más pestañas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <TabsTrigger
                    value="docs"
                    className="w-full justify-start rounded-md px-2 py-1.5 text-sm font-normal border-none data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    Documentación
                  </TabsTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <TabsTrigger
                    value="audit"
                    className="w-full justify-start rounded-md px-2 py-1.5 text-sm font-normal border-none data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    Auditoría
                  </TabsTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        </div>

        {/* CONTENIDO DE LOS TABS */}
        <TabsContent value="detalle" className="outline-none">
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
                  onSubmit={form.handleSubmit(onSubmit)}
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
