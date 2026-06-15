import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGenericQueries } from '@/hooks/use-crud';

import { usersService } from './users.service';

const keys = {
  all: (teamId: string) => ['teams', teamId, 'members'] as const,
};

export const usersQueries = {
  ...createGenericQueries(usersService, 'users'),
};
