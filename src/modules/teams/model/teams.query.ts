import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGenericQueries } from '@/hooks/use-crud';

import {
  BulkMemberIdsBody,
  BulkResponse,
  CreateTeamMember,
  GetTeamMembersQuery,
  TeamMember,
  TeamMemberListResponse,
} from './teams.schema';
import { teamsService } from './teams.service';

const keys = {
  all: (teamId: string) => ['teams', teamId, 'members'] as const,
  list: (teamId: string, query?: GetTeamMembersQuery) => [...keys.all(teamId), query] as const,
};

export const teamsQueries = {
  ...createGenericQueries(teamsService, 'teams'),
  // ── Lectura ───────────────────────────────────────────────────

  useGetMembers: (
    teamId: string,
    query?: GetTeamMembersQuery,
    options?: Omit<UseQueryOptions<TeamMemberListResponse, Error>, 'queryKey' | 'queryFn'>
  ) =>
    useQuery<TeamMemberListResponse, Error>({
      queryKey: keys.list(teamId, query),
      queryFn: () => teamsService.getMembers(teamId, query),
      enabled: !!teamId && (options?.enabled ?? true),
      ...options,
    }),

  // ── Operaciones individuales ──────────────────────────────────

  useAddMembers: () => {
    const qc = useQueryClient();
    return useMutation<TeamMember, Error, { teamId: string; body: CreateTeamMember }>({
      mutationFn: ({ teamId, body }) => teamsService.addMember(teamId, body),
      onSuccess: (_, { teamId }) => {
        qc.invalidateQueries({ queryKey: keys.all(teamId) });
      },
    });
  },

  useRemoveMembers: () => {
    const qc = useQueryClient();
    return useMutation<TeamMember, Error, { teamId: string; memberId: string }>({
      mutationFn: ({ teamId, memberId }) => teamsService.removeMember(teamId, memberId),
      onSuccess: (_, { teamId }) => {
        qc.invalidateQueries({ queryKey: keys.all(teamId) });
      },
    });
  },

  // ── Bulk ──────────────────────────────────────────────────────

  useAddMembersBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, { teamId: string; body: BulkMemberIdsBody }>({
      mutationFn: ({ teamId, body }) => teamsService.addMembersBulk(teamId, body),
      onSuccess: (_, { teamId }) => {
        qc.invalidateQueries({ queryKey: keys.all(teamId) });
      },
    });
  },

  useRemoveMembersBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, { teamId: string; body: BulkMemberIdsBody }>({
      mutationFn: ({ teamId, body }) => teamsService.removeMembersBulk(teamId, body),
      onSuccess: (_, { teamId }) => {
        qc.invalidateQueries({ queryKey: keys.all(teamId) });
      },
    });
  },
};
