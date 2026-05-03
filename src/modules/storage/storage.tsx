// src/components/data-table/example/documents-table.tsx
import {
  CheckCircle2,
  Download,
  ExternalLink,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  Filter,
  ListFilter,
  Sliders,
  Trash2,
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

const CONTENT_TYPE_OPTIONS = [
  { label: 'PDF', value: 'application/pdf', icon: FileText },
  { label: 'Image', value: 'image', icon: FileImage },
  { label: 'Video', value: 'video', icon: FileVideo },
  { label: 'ZIP', value: 'application/zip', icon: FileArchive },
  { label: 'Other', value: 'other', icon: File },
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
  // IsMobile
  const isMobile = useIsMobile();
  // ── Local filter/UI state ──────────────────────────────────────────────────
  const [filterMode, setFilterMode] = React.useState<FilterMode>('toolbar');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sort] = sorting; // Tomamos el primer criterio de ordenación
  const sortBy = sort ? sort.id : 'createdAt';
  const sortOrder = sort ? (sort.desc ? 'desc' : 'asc') : 'desc';

  // ── Server-side pagination + filter state ─────────────────────────────────
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [fileNameFilter, setFileNameFilter] = React.useState('');
  const [contentTypeFilter, setContentTypeFilter] = React.useState('');

  // Sync column filters → server-side params
  React.useEffect(() => {
    const fileNameCol = columnFilters.find((f) => f.id === 'fileName');
    setFileNameFilter(typeof fileNameCol?.value === 'string' ? fileNameCol.value : '');

    const contentTypeCol = columnFilters.find((f) => f.id === 'contentType');
    const ctValue = contentTypeCol?.value;
    // Pass all selected values joined by comma, or empty string
    setContentTypeFilter(Array.isArray(ctValue) ? ctValue.join(',') : ((ctValue as string) ?? ''));

    // Reset to page 1 when filters change
    setPage(1);
  }, [columnFilters]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useGetDocuments(
    entityType,
    entityId,
    isTrash,
    page,
    limit,
    fileNameFilter,
    contentTypeFilter,
    sortBy,
    sortOrder
  );

  // Adapt to whatever shape your API returns; adjust as needed:
  const documents: Document[] = data?.documents ?? [];
  const totalCount: number = data?.meta?.total ?? documents.length;

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<Document>[]>(
    () => [
      // Checkbox
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

      // File name
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

      // Content type
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
          return (value as string[]).some((v) => ct.startsWith(v) || ct === v);
        },
        meta: {
          label: 'Tipo',
          variant: 'multiSelect',
          options: CONTENT_TYPE_OPTIONS,
        },
      },

      // File size
      {
        accessorKey: 'size',
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Tamaño" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatBytes(row.getValue('size'))}
          </span>
        ),
      },

      // Upload date
      {
        accessorKey: 'createdAt',
        enableSorting: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Fecha" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums text-sm">
            {formatDate(row.getValue('createdAt'))}
          </span>
        ),
      },

      // Actions
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
    pageCount: data?.meta?.totalPages ?? 1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      {' '}
      <DataTable table={table} actionBar={<DataTableFloatingBar table={table} />}>
        {isMobile ? <DataTableToolbarMobile table={table} /> : <DataTableToolbar table={table} />}
      </DataTable>
    </div>
  );
}
