import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGenericQueries } from '@/hooks/use-crud';

import { BulkIdsBody, BulkResponse, Users } from './users.schema';
import { usersService } from './users.service';

const keys = {
  all: () => ['users'] as const,
};

export const usersQueries = {
  ...createGenericQueries(usersService, 'users'),

  useResendInvitation: () => {
    const qc = useQueryClient();
    return useMutation<Users, Error, string>({
      mutationFn: (usersId) => usersService.resendInvitation(usersId),
    });
  },

  useSuspend: () => {
    const qc = useQueryClient();
    return useMutation<Users, Error, string>({
      mutationFn: (usersId) => usersService.suspend(usersId),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all() }),
    });
  },

  useUnsuspend: () => {
    const qc = useQueryClient();
    return useMutation<Users, Error, string>({
      mutationFn: (usersId) => usersService.unsuspend(usersId),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all() }),
    });
  },

  useSuspendBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, BulkIdsBody>({
      mutationFn: (body) => usersService.suspendBulk(body),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all() }),
    });
  },

  useUnsuspendBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, BulkIdsBody>({
      mutationFn: (body) => usersService.unsuspendBulk(body),
      onSuccess: () => qc.invalidateQueries({ queryKey: keys.all() }),
    });
  },
};
