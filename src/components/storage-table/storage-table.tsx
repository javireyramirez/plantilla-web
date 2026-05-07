import { CalendarIcon, Download, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar-desktop';
import { DataTableToolbarMobile } from '@/components/data-table/data-table-toolbar-mobile';
import { Document, DocumentsTableProps } from '@/components/storage-table/storage-table-types';
import {
  CONTENT_TYPE_OPTIONS,
  getContentTypeIcon,
  getContentTypeLabel,
} from '@/components/storage-table/storage-table-utils';
import { useStorageTable } from '@/components/storage-table/use-storage-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatBytes, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export function DocumentsTable({ entityType, entityId, isTrash = false }: DocumentsTableProps) {
  const columns = React.useMemo<ColumnDef<Document>[]>(
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
        accessorKey: 'fileName',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Nombre" />,
        cell: ({ row }) => {
          const contentType = row.getValue('contentType') as string;
          const Icon = getContentTypeIcon(contentType);
          return (
            <div className="flex items-center gap-2 min-w-0">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium max-w-xs">{row.getValue('fileName')}</span>
            </div>
          );
        },
        meta: {
          label: 'Nombre de archivo',
          variant: 'text',
        },
      },
      {
        accessorKey: 'contentType',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Tipo" />,
        cell: ({ row }) => {
          const ct = row.getValue('contentType') as string;
          return (
            <Badge variant="secondary" className="font-mono text-xs">
              {getContentTypeLabel(ct)}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          const ct = row.getValue(id) as string;
          return (value as string[]).some(
            (v) =>
              CONTENT_TYPE_OPTIONS.find((opt) => opt.value === v)?.mimeTypes.includes(ct) ?? false
          );
        },
        meta: {
          label: 'Tipo',
          variant: 'multiSelect',
          options: CONTENT_TYPE_OPTIONS,
        },
      },
      {
        accessorKey: 'size',
        enableColumnFilter: true,
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Tamaño" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatBytes(row.getValue('size'))}
          </span>
        ),
        filterFn: 'inNumberRange',

        meta: {
          label: 'Tamaño',
          variant: 'range',
          range: [0, 25],
          unit: 'MB',
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
      {
        id: 'actions',
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Abrir"
                onClick={() => window.open(doc.url, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Descargar"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = doc.url;
                  a.download = doc.fileName;
                  a.click();
                }}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const { table, isLoading, isFetching, isMobile, limit } = useStorageTable({
    entityType,
    entityId,
    isTrash,
    columns,
  });

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
        actionBar={
          <DataTableFloatingBar
            table={table}
            actions={[
              {
                label: 'Delete',
                icon: <Trash2 className="h-4 w-4" />,
                variant: 'destructive',
                onClick: (rows) => toast.error(`${rows.length} tareas eliminadas`),
              },
              {
                label: 'Download',
                icon: <Download className="h-4 w-4" />,
                onClick: (rows) => toast.success(`Descargando ${rows.length} tareas...`),
              },
              {
                label: 'Download1',
                icon: <Download className="h-4 w-4" />,
                onClick: (rows) => toast.success(`Descargando ${rows.length} tareas...`),
              },
              {
                label: 'Download2',
                icon: <Download className="h-4 w-4" />,
                onClick: (rows) => toast.success(`Descargando ${rows.length} tareas...`),
              },
              {
                label: 'Download3',
                icon: <Download className="h-4 w-4" />,
                onClick: (rows) => toast.success(`Descargando ${rows.length} tareas...`),
              },
              {
                label: 'Download4',
                icon: <Download className="h-4 w-4" />,
                onClick: (rows) => toast.success(`Descargando ${rows.length} tareas...`),
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
