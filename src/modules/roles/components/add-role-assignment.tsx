import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import * as React from 'react';

import { Selector } from '@/components/selector/selector';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usersQueries } from '@/modules/users/model/users.query';
import { GetUsersQuery } from '@/modules/users/model/users.schema';

interface AddRoleAssignmentDrawerProps {
  excludeUserIds: string[];
  onAddAssignments: (targets: { userId: string }[]) => void;
  isAdding?: boolean;
}

function useUsersOptions(params: {
  page?: number;
  limit: number;
  isTrash?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  name?: string;
}) {
  const { name, ...rest } = params;
  const { data, isLoading } = usersQueries.useGetAll({
    page: rest.page ?? 1,
    isTrash: rest.isTrash ?? false,
    ...rest,
    sortBy: rest.sortBy as GetUsersQuery['sortBy'],
    search: name,
  });

  return {
    data:
      data?.data?.map((u: { id: string; name?: string | null; email?: string | null }) => ({
        id: u.id,
        name: u.name ?? u.email ?? u.id,
      })) ?? [],
    isLoading,
  };
}

export function AddRoleAssignmentDrawer({
  excludeUserIds,
  onAddAssignments,
  isAdding,
}: AddRoleAssignmentDrawerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!open) {
      setSelectedUserIds([]);
    }
  }, [open]);

  const handleApply = React.useCallback(() => {
    // Mapeamos los IDs planos de los usuarios al formato esperado por el CreateAssignmentBodySchema
    const targets = selectedUserIds.map((id) => ({ userId: id }));
    onAddAssignments(targets);
    setOpen(false);
  }, [onAddAssignments, selectedUserIds]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('roles.assignments.addBtn', { defaultValue: 'Asignar Miembro' })}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {t('roles.assignments.addTitle', { defaultValue: 'Asignar miembros al Rol' })}
          </SheetTitle>
          <SheetDescription>
            {t('roles.assignments.addDescription', {
              defaultValue:
                'Selecciona los usuarios a los que deseas otorgar los permisos de este rol.',
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          <Selector
            multiple
            applyButton={false}
            disabled={isAdding}
            value={selectedUserIds}
            onChange={setSelectedUserIds}
            excludeIds={excludeUserIds}
            useGetList={useUsersOptions}
            placeholder={t('teamMembers.selectUser')}
            searchPlaceholder={t('teamMembers.searchUser')}
            emptyMessage={t('teamMembers.noUsersFound')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isAdding}>
            {t('teams.cancel')}
          </Button>
          <Button onClick={handleApply} disabled={isAdding || selectedUserIds.length === 0}>
            {t('dataTable.selector.applyLabel')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
