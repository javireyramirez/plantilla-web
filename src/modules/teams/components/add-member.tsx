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
// NOTE: this is a placeholder adapter. Point it at your real "list users"
// query (org members, better-auth users, etc.) and map its response into
// { id, name }[] — that's all Selector needs.
import { usersQueries } from '@/modules/users/model/users.query';

interface AddMembersDrawerProps {
  excludeUserIds: string[];
  onAddMember: (userId: string) => void;
  isAdding?: boolean;
}

function useUsersOptions(params: {
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  name?: string;
}) {
  // NOTE: swap for your actual users list hook/endpoint.
  const { data, isLoading } = usersQueries.useGetAll(params);
  return {
    data: data?.data?.map((u: { id: string; name: string }) => ({ id: u.id, name: u.name })) ?? [],
    isLoading,
  };
}

export function AddMembersDrawer({ excludeUserIds, onAddMember, isAdding }: AddMembersDrawerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('teamMembers.add')}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('teamMembers.addTitle')}</SheetTitle>
          <SheetDescription>{t('teamMembers.addDescription')}</SheetDescription>
        </SheetHeader>

        <Selector
          multiple
          applyButton={false}
          disabled={isAdding}
          value={[]}
          onChange={(ids) => {
            const userId = ids[0];
            if (userId) onAddMember(userId);
          }}
          excludeIds={excludeUserIds}
          useGetList={useUsersOptions}
          placeholder={t('teamMembers.selectUser')}
          searchPlaceholder={t('teamMembers.searchUser')}
          emptyMessage={t('teamMembers.noUsersFound')}
        />
      </SheetContent>
    </Sheet>
  );
}
