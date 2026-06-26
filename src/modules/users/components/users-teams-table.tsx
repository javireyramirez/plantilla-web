import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as React from 'react';

import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableFloatingBar } from '@/components/data-table/data-table-floating-bar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar-desktop';
import { DataTableToolbarMobile } from '@/components/data-table/data-table-toolbar-mobile';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import useTableTeams from '../model/use-users-teams-table';
import { ResponseTeamRoleBase } from '../model/users.schema';

export function UsersTeamsTable({ userId }: { userId?: string }) {
  const { t } = useTranslation();

  const columns = React.useMemo<ColumnDef<ResponseTeamRoleBase>[]>(
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
            aria-label={t('users.teams.selectAll')}
            className="translate-y-0.5"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('users.teams.selectRow')}
            className="translate-y-0.5"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label={t('users.teams.name')} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
        meta: {
          label: t('users.teams.name'),
          variant: 'text',
        },
      },
    ],
    [t]
  );

  if (!userId) {
    return <div>Error.</div>;
  }

  const { table, isLoading, isFetching, isMobile, handleRemove, handleAdd, isPendingActions } =
    useTableTeams(columns, userId);

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={5} withPagination={false} />;
  }

  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        isFetching && !isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      )}
    >
      <DataTable
        table={table}
        mobileConfig={{ primaryColumn: 'name', stackedColumns: [] }}
        actionBar={
          <DataTableFloatingBar
            table={table}
            actions={[
              {
                label: t('users.teams.remove'),
                icon: <Trash2 className="h-4 w-4" />,
                variant: 'destructive',
                disabled: isPendingActions,
                onClick: (rows) => handleRemove(rows),
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
