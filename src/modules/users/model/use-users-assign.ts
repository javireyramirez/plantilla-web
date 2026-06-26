import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { usersQueries } from './users.query';
import { UpdateUserAssignmentsBody, UserAssignmentsResponse } from './users.schema';

export function useUsersForm(id?: string) {
  const { t } = useTranslation();

  const { mutate: addAssignments, isPending: isAddingAssignments } =
    usersQueries.useAddAssignments();

  const { mutate: removeAssignments, isPending: isRemovingAssignments } =
    usersQueries.useRemoveAssignments();

  const handleAddAssignments = (body: UpdateUserAssignmentsBody) => {
    if (!id) return;

    addAssignments(
      { usersId: id, body },
      {
        onSuccess: () => {
          toast.success(t('users.form.addAssignments'));
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message || error?.message;
          toast.error(serverMessage || t('users.form.errors.addAssignments'));
        },
      }
    );
  };

  const handleRemoveAssignments = (body: UpdateUserAssignmentsBody) => {
    if (!id) return;

    removeAssignments(
      { usersId: id, body },
      {
        onSuccess: () => {
          toast.success(t('users.form.removeAssignments'));
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message || error?.message;
          toast.error(serverMessage || t('users.form.errors.removeAssignments'));
        },
      }
    );
  };

  return {
    handleAddAssignments,
    handleRemoveAssignments,
    isPending: isAddingAssignments || isRemovingAssignments,
  };
}
