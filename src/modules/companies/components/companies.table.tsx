import { CalendarIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar-desktop';
import { DataTableToolbarMobile } from '@/components/data-table/data-table-toolbar-mobile';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Company } from '@/modules/companies/companies.schema';

import { SECTOR_OPTIONS } from '../companies.types';
import useCompanies from '../use-companies';

export function CompaniesTable() {
  const columns = React.useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: 'select',
        maxSize: 40,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Seleccionar todo"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Compañía" />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2 min-w-0">
              <button
                className="truncate font-medium max-w-xs text-blue-500 hover:text-blue-700 hover:underline text-left"
                onClick={() => console.log(row.original.id)}
              >
                {row.getValue('name')}
              </button>
            </div>
          );
        },
        meta: {
          label: 'Compañía',
          variant: 'text',
        },
      },
      {
        accessorKey: 'nif',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="CIF" />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2 min-w-0">
              <button
                className="truncate font-medium max-w-xs text-blue-500 hover:text-blue-700 hover:underline text-left"
                onClick={() => console.log(row.original.id)}
              >
                {row.getValue('nif')}
              </button>
            </div>
          );
        },
        meta: {
          label: 'CIF',
          variant: 'text',
        },
      },
      {
        accessorKey: 'sector',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Sector" />,
        cell: ({ row }) => {
          const sectorValue = row.getValue('sector');
          const sectorOpt = SECTOR_OPTIONS.find((opt) => opt.value === sectorValue);

          return (
            <div className="flex items-center gap-2 min-w-0">
              {sectorOpt ? sectorOpt.label : 'Sin sector'}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const ct = row.getValue(id) as string;
          return (value as string[]).some(
            (v) => SECTOR_OPTIONS.find((opt) => opt.value === v) ?? false
          );
        },
        meta: {
          label: 'Sector',
          variant: 'multiSelect',
          options: SECTOR_OPTIONS,
        },
      },
      {
        accessorKey: 'createdAt',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Fecha" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums text-sm">
            {formatDate(row.getValue('createdAt'))}
          </span>
        ),
        meta: {
          label: 'Creación',
          variant: 'dateRange',
          icon: CalendarIcon,
        },
      },
    ],
    []
  );

  const {
    table,
    totalRows,
    isLoading,
    isFetching,
    isMobile,
    limit,
    handleDelete,
    isPendingActions,
  } = useCompanies(columns);

  // Skeleton
  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        rowCount={limit}
        filterCount={4}
        withPagination={true}
      />
    );
  }

  // Tabla
  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        isFetching && !isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      )}
    >
      <DataTable
        table={table}
        totalCount={totalRows}
        mobileConfig={{
          primaryColumn: 'name',
          stackedColumns: ['sector', 'createdAt'],
        }}
        actionBar={
          <DataTableFloatingBar
            table={table}
            actions={[
              {
                label: 'Delete',
                icon: <Trash2 className="h-4 w-4" />,
                variant: 'destructive',
                disabled: isPendingActions,
                onClick: (rows) => handleDelete(rows),
              },
            ]}
          />
        }
      >
        {isMobile ? <DataTableToolbarMobile table={table} /> : <DataTableToolbar table={table} />}
      </DataTable>
    </div>
  );
}
