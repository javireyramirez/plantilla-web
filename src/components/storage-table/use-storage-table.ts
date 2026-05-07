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

import { Document, DocumentsTableProps } from '@/components/storage-table/storage-table-types';
import { CONTENT_TYPE_OPTIONS } from '@/components/storage-table/storage-table-utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetDocuments } from '@/hooks/use-storage';
import { GetDocumentsQuery } from '@/schemas/storage.schema';

export function useStorageTable({
  entityType,
  entityId,
  isTrash = false,
  columns,
}: DocumentsTableProps) {
  const isMobile = useIsMobile();

  // ── Local filter/UI state ──────────────────────────────────────────────────
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // ── Paginación y filtros ───────────────────────────────────────────────────
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [sort] = sorting;

  const sortBy = (sort ? sort.id : 'createdAt') as GetDocumentsQuery['sortBy'];
  const sortOrder = sort ? (sort.desc ? 'desc' : 'asc') : 'desc';

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
  const totalPages: number = data?.meta?.totalPages ?? 1;

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

    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,

    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },

    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPage(1);
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

  //Funcion de borrado y descarga

  return {
    table,

    isLoading,
    isFetching,
    isMobile,

    limit,
  };
}
