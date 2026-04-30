import { ArrowUpDown } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

// Tu tipo de dato de ejemplo
export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'inactivo';
};

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: 'nombre',
    // ASÍ SE HACE LA CABECERA SIMPLE ORDENABLE:
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // Al tocar la cabecera/flechas, alterna el orden (ascendente/descendente)
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4" // Pequeño ajuste para alinear con el texto de abajo
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Correo Electrónico', // Columna sin ordenamiento
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
