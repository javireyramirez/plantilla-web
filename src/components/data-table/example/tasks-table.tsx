// src/components/data-table/example/tasks-table.tsx
import * as React from 'react';
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { CheckCircle2, Circle, HelpCircle, XCircle, ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { tasks, type Task } from '@/mocks/tasks';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export function TasksTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Task" />
        ),
        cell: ({ row }) => <div className="w-[80px] font-mono">{row.getValue('id')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Badge variant="outline">{row.original.label}</Badge>
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue('title')}
              </span>
            </div>
          );
        },
        meta: {
          label: 'Title',
          variant: 'text',
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const Icon = {
            todo: Circle,
            'in-progress': HelpCircle,
            done: CheckCircle2,
            canceled: XCircle,
          }[status] || Circle;

          return (
            <div className="flex w-[100px] items-center">
              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{status.replace('-', ' ')}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          label: 'Status',
          variant: 'multiSelect',
          options: [
            { label: 'Todo', value: 'todo', icon: Circle },
            { label: 'In Progress', value: 'in-progress', icon: HelpCircle },
            { label: 'Done', value: 'done', icon: CheckCircle2 },
            { label: 'Canceled', value: 'canceled', icon: XCircle },
          ],
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Priority" />
        ),
        cell: ({ row }) => {
          const priority = row.getValue('priority') as string;
          const Icon = {
            low: ArrowDown,
            medium: ArrowRight,
            high: ArrowUp,
          }[priority] || ArrowRight;

          return (
            <div className="flex items-center">
              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{priority}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          label: 'Priority',
          variant: 'multiSelect',
          options: [
            { label: 'Low', value: 'low', icon: ArrowDown },
            { label: 'Medium', value: 'medium', icon: ArrowRight },
            { label: 'High', value: 'high', icon: ArrowUp },
          ],
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      table={table}
      actionBar={<DataTableFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
