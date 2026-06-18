// import { Building2, ChevronDown, Download, MoreHorizontal, Plus, Save, Trash2 } from 'lucide-react';
// import { Controller } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';
// import { Link, useParams } from 'react-router-dom';

// import { useState } from 'react';

// import FormFieldWrapper from '@/components/form/form-field-wrapper.js';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { DocumentsTable, FileUploadButton } from '@/features/storage';
// import { SECTOR_OPTIONS } from '@/modules/companies/model/companies.types';
// import { useCompanyForm } from '@/modules/companies/model/use-companies-detail';

// export default function CompanyDetail() {
//   const { t } = useTranslation();

//   // --- Estados locales ---
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [shouldCloseOnSubmit, setShouldCloseOnSubmit] = useState(false);
//   const [activeTab, setActiveTab] = useState('detail');

//   // --- Hooks de datos y formulario ---
//   const { id } = useParams<{ id: string }>();
//   const { isEditing, companyName, isLoading, form, handleSubmit, handleDelete, isPending } =
//     useCompanyForm(id);

//   const tabs = [
//     { value: 'detail', label: t('companies.detail'), viewAtCreate: true },
//     { value: 'docs', label: t('companies.docs'), viewAtCreate: isEditing },
//     { value: 'audit', label: t('companies.audit'), viewAtCreate: isEditing },
//   ];

//   const currentTab = tabs.find((tab) => tab.value === activeTab);

//   // --- Estado de Carga (Skeletons) ---
//   if (isLoading) {
//     return (
//       <div className="space-y-6 mx-auto p-4 md:p-6">
//         <div className="flex items-center gap-2">
//           <Skeleton className="h-4 w-20" />
//           <Skeleton className="h-4 w-4 rounded-full" />
//           <Skeleton className="h-4 w-32" />
//         </div>

//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
//           <div className="space-y-2 w-full sm:w-auto">
//             <div className="flex items-center gap-2">
//               <Skeleton className="h-5 w-5 rounded-md" />
//               <Skeleton className="h-6 w-48" />
//             </div>
//             <Skeleton className="h-4 w-64 hidden sm:block" />
//           </div>
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <Skeleton className="h-10 flex-1 sm:flex-none sm:w-28" />
//             <Skeleton className="h-10 w-10 sm:w-24 hidden sm:block" />
//             <Skeleton className="h-10 w-10 sm:w-24 hidden sm:block" />
//           </div>
//         </div>

//         <div className="border-b pb-2 flex gap-6">
//           <Skeleton className="h-5 w-16" />
//           <Skeleton className="h-5 w-28" />
//           <Skeleton className="h-5 w-20" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           <Card className="lg:col-span-1 shadow-sm">
//             <CardHeader className="space-y-2">
//               <Skeleton className="h-5 w-32" />
//               <Skeleton className="h-4 w-48" />
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Skeleton className="h-3 w-16" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//               <div className="space-y-2">
//                 <Skeleton className="h-3 w-16" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//               <div className="space-y-2">
//                 <Skeleton className="h-3 w-14" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm">
//             <CardHeader className="space-y-2">
//               <Skeleton className="h-5 w-40" />
//               <Skeleton className="h-4 w-36" />
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-5/6" />
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm">
//             <CardHeader className="space-y-2">
//               <Skeleton className="h-5 w-36" />
//               <Skeleton className="h-4 w-44" />
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-4/5" />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   // --- Renderizado Principal ---
//   return (
//     <div className="space-y-6 mx-auto p-4 md:p-6">
//       {/* SECCIÓN: Breadcrumb */}
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink asChild className="transition-colors hover:text-foreground">
//               <Link to="/companies">{t('companies.title')}</Link>
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator />
//           <BreadcrumbItem>
//             <BreadcrumbPage className="font-medium text-foreground">
//               {isEditing ? `${companyName}` : t('companies.createTitle')}
//             </BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>

//       {/* SECCIÓN: Barra de Acciones Adaptativa Global */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
//         <div className="space-y-1">
//           <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
//             <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
//             {isEditing ? (
//               <span className="truncate">
//                 <span className="text-primary">{companyName}</span>
//               </span>
//             ) : (
//               t('companies.createTitle')
//             )}
//           </h1>
//           <p className="text-sm text-muted-foreground hidden sm:block">
//             {isEditing ? t('companies.editDescription') : t('companies.createDescription')}
//           </p>
//         </div>

//         {/* Contenedor Único de Botones (Control de responsividad fluido) */}
//         <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
//           {isEditing && (
//             <>
//               {/* Exportar y Eliminar: Visibles a partir de pantallas grandes (lg) */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="hidden lg:flex gap-2"
//                 disabled={isPending}
//               >
//                 <Download className="h-4 w-4" />
//                 {t('companies.export')}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="hidden lg:flex border-destructive text-destructive hover:bg-destructive hover:text-white gap-2"
//                 onClick={() => setDeleteDialogOpen(true)}
//               >
//                 <Trash2 className="h-4 w-4" />
//                 {t('companies.delete')}
//               </Button>

//               {/* Nueva Compañía: Visible solo en pantallas muy grandes (xl) */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="hidden xl:flex gap-2"
//                 disabled={isPending}
//                 asChild
//               >
//                 <Link to="/companies/new">
//                   <Plus className="h-4 w-4" />
//                   {t('companies.new')}
//                 </Link>
//               </Button>
//             </>
//           )}

//           {/* Botón Guardar y Cerrar: Visible a partir de pantallas medianas (md) */}
//           <Button
//             form="company-form-id"
//             type="submit"
//             variant="outline"
//             disabled={isPending}
//             onClick={() => setShouldCloseOnSubmit(true)}
//             className="hidden md:flex gap-2"
//           >
//             <Save className="h-4 w-4" />
//             {t('companies.saveAndClose')}
//           </Button>

//           {/* Acción Principal: Siempre visible */}
//           <Button
//             form="company-form-id"
//             type="submit"
//             disabled={isPending}
//             onClick={() => setShouldCloseOnSubmit(false)}
//             className="gap-2 shadow-sm flex-1 sm:flex-none justify-center"
//           >
//             <Save className="h-4 w-4" />
//             {t('companies.save')}
//           </Button>

//           {/* Menú Desplegable Adaptativo: Captura los botones que desaparecen según el breakpoint */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className={`px-3 ${isEditing ? 'xl:hidden' : 'md:hidden'}`}>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-48">
//               {/* Se muestra en el menú si la pantalla es menor a md */}
//               <DropdownMenuItem
//                 disabled={isPending}
//                 className="md:hidden gap-2"
//                 onSelect={(e) => {
//                   e.preventDefault();
//                   setShouldCloseOnSubmit(true);
//                   form.handleSubmit((data) => handleSubmit(data, { shouldClose: true }))();
//                 }}
//               >
//                 <Save className="h-4 w-4" />
//                 {t('companies.saveAndClose')}
//               </DropdownMenuItem>

//               {isEditing && (
//                 <>
//                   {/* Se muestra en el menú si la pantalla es menor a lg */}
//                   <DropdownMenuItem disabled={isPending} className="lg:hidden gap-2">
//                     <Download className="h-4 w-4" />
//                     {t('companies.export')}
//                   </DropdownMenuItem>

//                   {/* Se muestra en el menú si la pantalla es menor a xl */}
//                   <DropdownMenuItem disabled={isPending} className="xl:hidden gap-2" asChild>
//                     <Link to="/companies/new">
//                       <Download className="h-4 w-4" />
//                       {t('companies.new')}
//                     </Link>
//                   </DropdownMenuItem>

//                   {/* Se muestra en el menú si la pantalla es menor a lg */}
//                   <DropdownMenuItem
//                     disabled={isPending}
//                     className="lg:hidden gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
//                     onSelect={(e) => {
//                       e.preventDefault();
//                       setDeleteDialogOpen(true);
//                     }}
//                   >
//                     <Trash2 className="h-4 w-4 text-destructive" />
//                     {t('companies.delete')}
//                   </DropdownMenuItem>
//                 </>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* SECCIÓN: Navegación por Pestañas (Tabs) */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
//         {/* Vista Escritorio */}
//         <TabsList
//           variant="line"
//           className="hidden md:flex h-auto w-fit justify-start gap-6 rounded-none border-b bg-transparent p-0"
//         >
//           {tabs
//             .filter((t) => t.viewAtCreate === true)
//             .map((tab) => (
//               <TabsTrigger key={tab.value} value={tab.value} className="px-0 w-32 shrink-0">
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//         </TabsList>

//         {/* Vista Móvil */}
//         <div className="border-b md:hidden">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-12 px-0 text-base font-medium">
//                 {currentTab?.label}
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start" className="w-64">
//               {tabs.map((tab) => (
//                 <DropdownMenuItem key={tab.value} onClick={() => setActiveTab(tab.value)}>
//                   {tab.label}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* CONTENIDO DE LAS PESTAÑAS */}
//         <TabsContent value="detail" className="outline-none">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//             {/* Formulario de Datos Básicos */}
//             <Card className="lg:col-span-1 shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-base font-semibold">
//                   {t('companies.basicData')}
//                 </CardTitle>
//                 <CardDescription>{t('companies.identificationInfo')}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form
//                   id="company-form-id"
//                   onSubmit={form.handleSubmit((data) =>
//                     handleSubmit(data, { shouldClose: shouldCloseOnSubmit })
//                   )}
//                   className="space-y-4"
//                 >
//                   <FieldGroup className="space-y-4">
//                     <Controller
//                       name="name"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <FormFieldWrapper fieldState={fieldState}>
//                           <FieldLabel
//                             htmlFor="company-name"
//                             className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
//                           >
//                             {t('companies.name')}
//                           </FieldLabel>
//                           <Input
//                             {...field}
//                             id="company-name"
//                             aria-invalid={fieldState.invalid}
//                             data-invalid={fieldState.invalid}
//                             placeholder={t('companies.namePlaceholder')}
//                             autoComplete="off"
//                             className="mt-1.5 focus-visible:ring-primary"
//                           />
//                         </FormFieldWrapper>
//                       )}
//                     />

//                     <Controller
//                       name="nif"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <FormFieldWrapper fieldState={fieldState}>
//                           <FieldLabel
//                             htmlFor="company-nif"
//                             className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
//                           >
//                             {t('companies.cifNif')}
//                           </FieldLabel>
//                           <Input
//                             {...field}
//                             id="company-nif"
//                             aria-invalid={fieldState.invalid}
//                             data-invalid={fieldState.invalid}
//                             placeholder="A1234567B"
//                             autoComplete="off"
//                             className="mt-1.5 focus-visible:ring-primary"
//                           />
//                         </FormFieldWrapper>
//                       )}
//                     />

//                     <Controller
//                       name="sector"
//                       control={form.control}
//                       render={({ field, fieldState }) => (
//                         <FormFieldWrapper fieldState={fieldState}>
//                           <FieldLabel
//                             htmlFor="company-sector"
//                             className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
//                           >
//                             {t('companies.sector')}
//                           </FieldLabel>
//                           <Select value={field.value ?? undefined} onValueChange={field.onChange}>
//                             <SelectTrigger
//                               id="company-sector"
//                               className="mt-1.5 focus-visible:ring-primary w-full"
//                               aria-invalid={fieldState.invalid}
//                               data-invalid={fieldState.invalid}
//                             >
//                               <SelectValue placeholder={t('companies.selectSector')} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {SECTOR_OPTIONS.map((option) => (
//                                 <SelectItem key={option.value} value={option.value}>
//                                   {t(`companies.sectors.${option.value}`)}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormFieldWrapper>
//                       )}
//                     />
//                   </FieldGroup>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Tarjetas Secundarias Estatales */}
//             <Card className="shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-base font-semibold">
//                   {t('companies.additionalInfo')}
//                 </CardTitle>
//                 <CardDescription>{t('companies.pendingDefine')}</CardDescription>
//               </CardHeader>
//               <CardContent className="text-sm text-muted-foreground leading-relaxed">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.
//               </CardContent>
//             </Card>

//             <Card className="shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-base font-semibold">
//                   {t('companies.metricsSummary')}
//                 </CardTitle>
//                 <CardDescription>{t('companies.entityStats')}</CardDescription>
//               </CardHeader>
//               <CardContent className="text-sm text-muted-foreground leading-relaxed">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget elit nec.
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {isEditing && (
//           <>
//             <TabsContent
//               value="docs"
//               className="p-4 border rounded-xl bg-card text-muted-foreground text-sm flex flex-col gap-6"
//             >
//               <div className="flex justify-end">
//                 <FileUploadButton entityType="companies" entityId={id!} multiple={true} />
//               </div>

//               <DocumentsTable entityType="companies" entityId={id!} />
//             </TabsContent>

//             <TabsContent
//               value="audit"
//               className="p-4 border rounded-xl bg-card text-muted-foreground text-sm"
//             >
//               {t('companies.auditContent')}
//             </TabsContent>
//           </>
//         )}
//       </Tabs>

//       {/* SECCIÓN: Diálogo de Confirmación de Borrado Único (Centralizado) */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t('companies.deleteConfirmTitle')}</AlertDialogTitle>
//             <AlertDialogDescription>{t('companies.deleteConfirmDesc')}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>{t('companies.cancel')}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} variant="destructive">
//               {t('companies.delete')}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
