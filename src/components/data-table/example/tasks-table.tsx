// src/components/data-table/example/tasks-table.tsx
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Filter,
  HelpCircle,
  ListFilter,
  Sliders,
  XCircle,
} from 'lucide-react';

import * as React from 'react';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list';
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { type Task, tasks } from '@/mocks/tasks';

type FilterMode = 'toolbar' | 'command' | 'advanced';

export function TasksTable() {
  const isMobile = useIsMobile();
  const [filterMode, setFilterMode] = React.useState<FilterMode>('toolbar');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<Task>[]>(
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
            aria-label="Select all"
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        enableColumnFilter: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Task" />,
        cell: ({ row }) => <div className="w-20 font-mono">{row.getValue('id')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'title',
        enableColumnFilter: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Badge variant="outline">{row.original.label}</Badge>
              <span className="max-w-125 truncate font-medium">{row.getValue('title')}</span>
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
        enableColumnFilter: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const Icon =
            {
              todo: Circle,
              'in-progress': HelpCircle,
              done: CheckCircle2,
              canceled: XCircle,
            }[status] || Circle;

          return (
            <div className="flex w-25 items-center">
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
        enableColumnFilter: true,
        header: ({ column }) => <DataTableColumnHeader column={column} label="Priority" />,
        cell: ({ row }) => {
          const priority = row.getValue('priority') as string;
          const Icon =
            {
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

  const filterModeToggle = (
    <ToggleGroup
      type="single"
      value={filterMode}
      onValueChange={(value) => value && setFilterMode(value as FilterMode)}
    >
      <ToggleGroupItem value="toolbar" aria-label="Toolbar filters">
        <Filter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="command" aria-label="Command filters">
        <ListFilter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="advanced" aria-label="Advanced filters">
        <Sliders className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
  console.log(filterMode);

  return (
    <DataTable table={table} actionBar={<DataTableFloatingBar table={table} />}>
      {filterMode === 'toolbar' && (
        <DataTableToolbar table={table}>{filterModeToggle}</DataTableToolbar>
      )}
      {filterMode === 'command' && (
        <DataTableFilterMenu table={table}>{filterModeToggle}</DataTableFilterMenu>
      )}
      {filterMode === 'advanced' && (
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          {filterModeToggle}
        </DataTableAdvancedToolbar>
      )}
      {filterModeToggle}
    </DataTable>
  );
}
