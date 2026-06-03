'use client';

import { ChevronDown, Download, MoreHorizontal, Save, Trash2 } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const tabs = [
    { value: 'detail', label: 'Detalle' },
    { value: 'docs', label: 'Documentación' },
    { value: 'audit', label: 'Auditoría' },
    { value: 'contacts', label: 'Contactos' },
    { value: 'invoices', label: 'Facturas' },
    { value: 'notes', label: 'Notas' },
  ];

  const [activeTab, setActiveTab] = useState('detail');

  const currentTab = tabs.find((tab) => tab.value === activeTab);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Cliente ACME S.L.</h1>

          <p className="hidden text-sm text-muted-foreground md:block">
            Ejemplo genérico para CRM, ERP o Renting.
          </p>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <Button variant="outline" className="border-destructive text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>

          <Button>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-2">
          <Button>
            <Save className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </DropdownMenuItem>

              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

        <TabsContent value="detail">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Detalle</h2>

            <p className="text-muted-foreground">Información principal de la entidad.</p>
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Documentación</h2>

            <p className="text-muted-foreground">Archivos y documentos.</p>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Auditoría</h2>

            <p className="text-muted-foreground">Registro de cambios.</p>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Contactos</h2>

            <p className="text-muted-foreground">Personas relacionadas.</p>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Facturas</h2>

            <p className="text-muted-foreground">Gestión económica.</p>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="rounded-xl border p-6">
            <h2 className="mb-2 font-semibold">Notas</h2>

            <p className="text-muted-foreground">Comentarios internos.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
