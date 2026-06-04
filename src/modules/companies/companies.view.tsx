import { Building2, Download, MoreHorizontal, Plus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CompaniesTable } from './components/companies.table';

export default function CompaniesView() {
  return (
    // 🌟 flex-col y space-y-6 para separar perfectamente la cabecera de la tabla
    <div className="flex flex-col space-y-6">
      {/* CABECERA DE LA VISTA: Título a la izquierda, botones a la derecha */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Título e información de contexto (Alineado a la izquierda) */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Compañías
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona y visualiza el listado de empresas registradas.
          </p>
        </div>

        {/* CONTENEDOR DE BOTONES (Alineado a la derecha) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* 1. ACCIÓN SECUNDARIA (Escritorio): Exportar va antes (a la izquierda) */}
          <div className="hidden sm:flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <Button asChild size="sm" className="gap-2 shadow-sm flex-1 sm:flex-none justify-center">
            <Link to="/companies/new">
              <Plus className="h-4 w-4" />
              Nueva compañía
            </Link>
          </Button>

          {/* ACCIÓN SECUNDARIA (Móvil): Menú para pantallas pequeñas */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="px-3">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Más acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Importar
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  Exportar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="rounded-xl border bg-card shadow-sm">
        <CompaniesTable />
      </div>
    </div>
  );
}
