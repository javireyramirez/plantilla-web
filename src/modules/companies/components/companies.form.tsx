import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, ChevronDown, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

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
import { useCompanyForm } from '@/modules/companies/use-companies-form';

import { CreateCompany, CreateCompanyBodySchema } from '../companies.schema';

export default function CompanyForm() {
  const tabs = [
    { value: 'detail', label: 'Detalle' },
    { value: 'docs', label: 'Documentación' },
    { value: 'audit', label: 'Auditoría' },
  ];

  const [activeTab, setActiveTab] = useState('detail');

  const currentTab = tabs.find((tab) => tab.value === activeTab);

  const { id } = useParams<{ id: string }>();
  const { isEditing, defaultValues, isLoading, handleSubmit, isPending } = useCompanyForm(id);

  const form = useForm<CreateCompany>({
    resolver: zodResolver(CreateCompanyBodySchema),
    mode: 'onBlur',
    defaultValues: defaultValues ?? { name: '', nif: '', sector: '' },
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues]);

  const companyName = useWatch({ control: form.control, name: 'name' });

  return (
    <div className="space-y-6  mx-auto p-4 md:p-6">
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
            type="submit"
            form="company-form-id"
            disabled={isPending}
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
                  <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
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
      <Tabs defaultValue="detail" className="w-full space-y-6">
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
                  onSubmit={form.handleSubmit((id) => handleSubmit(id))}
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
