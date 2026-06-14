import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGenericQueries } from '@/hooks/use-crud';

import { rolesService } from './roles.service';

const keys = {
  all: (teamId: string) => ['teams', teamId, 'members'] as const,
};

export const rolesQueries = {
  ...createGenericQueries(rolesService, 'roles'),
};
