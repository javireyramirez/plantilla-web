// src/components/data-table/example/documents-table.tsx
import {
  Archive,
  CalendarIcon,
  Download,
  ExternalLink,
  File,
  FileArchive,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Filter,
  ListFilter,
  Presentation,
  Sliders,
} from 'lucide-react';

import * as React from 'react';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar-desktop';
import { DataTableToolbarMobile } from '@/components/data-table/data-table-toolbar-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetDocuments } from '@/hooks/use-storage';
import { cn } from '@/lib/utils';
import { GetDocumentsQuery } from '@/schemas/storage.schema';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  isTrash: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const CONTENT_TYPE_OPTIONS = [
  {
    label: 'Documentos',
    value: 'document',
    icon: FileText,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'text/plain',
      'text/markdown',
      'application/rtf',
    ],
  },
  {
    label: 'Hojas de Cálculo',
    value: 'spreadsheet',
    icon: FileSpreadsheet,
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet',
      'text/csv',
      'text/tab-separated-values',
    ],
  },
  {
    label: 'Presentaciones',
    value: 'presentation',
    icon: Presentation,
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.presentation',
    ],
  },
  {
    label: 'Imágenes',
    value: 'image',
    icon: FileImage,
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/avif',
      'image/tiff',
      'image/bmp',
    ],
  },
  {
    label: 'Datos',
    value: 'data',
    icon: FileJson,
    mimeTypes: ['application/json', 'application/xml', 'text/xml'],
  },
  {
    label: 'Archivos',
    value: 'archive',
    icon: Archive,
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
  },
];
function getContentTypeIcon(contentType: string) {
  if (contentType === 'application/pdf') return FileText;
  if (contentType.startsWith('image/')) return FileImage;
  if (contentType.startsWith('video/')) return FileVideo;
  if (contentType.includes('zip') || contentType.includes('archive')) return FileArchive;
  return File;
}

function getContentTypeLabel(contentType: string) {
  if (contentType === 'application/pdf') return 'PDF';
  if (contentType.startsWith('image/')) return 'Image';
  if (contentType.startsWith('video/')) return 'Video';
  if (contentType.includes('zip') || contentType.includes('archive')) return 'ZIP';
  return contentType.split('/')[1]?.toUpperCase() ?? 'File';
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Filter mode toggle ───────────────────────────────────────────────────────

type FilterMode = 'toolbar' | 'command' | 'advanced';

// ─── Component ────────────────────────────────────────────────────────────────

interface DocumentsTableProps {
  entityType: string;
  entityId: string;
  isTrash?: boolean;
}

export function DocumentsTable({ entityType, entityId, isTrash = false }: DocumentsTableProps) {
  const isMobile = useIsMobile();

  // ── Local filter/UI state ──────────────────────────────────────────────────
  const [filterMode, setFilterMode] = React.useState<FilterMode>('toolbar');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // ── Pagination state ───────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // ── Derivar parámetros para la API a partir del estado de la tabla ─────────
  const [sort] = sorting;

  const sortBy = (sort ? sort.id : 'createdAt') as GetDocumentsQuery['sortBy'];
  const sortOrder = sort ? (sort.desc ? 'desc' : 'asc') : 'desc';

  // Extraemos los filtros activos directamente de columnFilters
  const fileNameCol = columnFilters.find((f) => f.id === 'fileName');
  const fileName = typeof fileNameCol?.value === 'string' ? fileNameCol.value : undefined;

  const contentTypeCol = columnFilters.find((f) => f.id === 'contentType');
  const contentTypes =
    Array.isArray(contentTypeCol?.value) && contentTypeCol.value.length > 0
      ? contentTypeCol.value.flatMap((selectedValue: string) => {
          const option = CONTENT_TYPE_OPTIONS.find((opt) => opt.value === selectedValue);
          return option ? option.mimeTypes : [];
        })
      : undefined;

  const sizeCol = columnFilters.find((f) => f.id === 'size');
  const [sizeMin, sizeMax] = Array.isArray(sizeCol?.value) ? sizeCol.value : [undefined, undefined];

  const createdAtCol = columnFilters.find((f) => f.id === 'createdAt');
  const [createdFrom, createdTo] = Array.isArray(createdAtCol?.value)
    ? createdAtCol.value
    : [undefined, undefined];

  // ── Data fetching ──────────────────────────────────────────────────────────
  // Pasamos un único objeto que coincida con el GetDocumentsQuery de Zod
  const { data, isLoading, isFetching } = useGetDocuments(entityType, entityId, {
    isTrash,
    page,
    limit,
    sortBy,
    sortOrder,
    ...(fileName && { fileName }),
    ...(contentTypes && { contentTypes }),
    sizeMin: sizeMin ? sizeMin * 1024 * 1024 : undefined,
    sizeMax: sizeMax ? sizeMax * 1024 * 1024 : undefined,
    createdFrom: createdFrom ? createdFrom : undefined,
    createdTo: createdTo ? createdTo : undefined,
  });

  const documents: Document[] = data?.documents ?? [];
  const totalCount: number = data?.meta?.total ?? documents.length;
  const totalPages: number = data?.meta?.totalPages ?? 1;

  // ── Columns ───────────────────────────────────────────────────────────────
  // (Sin cambios significativos, se mantiene igual)
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

  // ── Table instance ─────────────────────────────────────────────────────────
  const table = useReactTable({
    data: documents,
    columns,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // Controladores de eventos de la tabla
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,

    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1); // Siempre resetear a la primera página al cambiar el orden
    },

    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPage(1); // Reemplaza al useEffect anterior. Al filtrar, volvemos a la pág 1.
    },

    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: limit }) : updater;

      if (next.pageSize !== limit) {
        setPage(1);
      } else {
        setPage(next.pageIndex + 1);
      }
      setLimit(next.pageSize);
    },
  });

  // ── Filter mode toggle widget ──────────────────────────────────────────────
  const filterModeToggle = (
    <ToggleGroup
      type="single"
      value={filterMode}
      onValueChange={(value) => value && setFilterMode(value as FilterMode)}
    >
      <ToggleGroupItem value="toolbar" aria-label="Filtros en toolbar">
        <Filter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="command" aria-label="Filtros en comando">
        <ListFilter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="advanced" aria-label="Filtros avanzados">
        <Sliders className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );

  // --- LÓGICA DEL SKELETON ---
  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        rowCount={limit}
        filterCount={filterMode === 'toolbar' ? 2 : 0}
        withPagination={true}
      />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        isFetching && !isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      )}
    >
      <DataTable table={table} actionBar={<DataTableFloatingBar table={table} />}>
        {isMobile ? <DataTableToolbarMobile table={table} /> : <DataTableToolbar table={table} />}
      </DataTable>
    </div>
  );
}
