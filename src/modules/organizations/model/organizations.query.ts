import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGenericQueries } from '@/hooks/use-crud';

import {
  BulkMemberIdsBody,
  BulkResponse,
  CreateMember,
  GetMembersQuery,
  MemberListResponse,
  OrganizationDeleteResponseSchema,
  OrganizationMember,
} from './organizations.schema';
import { organizationsService } from './organizations.service';

const keys = {
  all: (organizationId: string) => ['organizations', organizationId, 'members'] as const,
  list: (organizationId: string, query?: GetMembersQuery) =>
    [...keys.all(organizationId), query] as const,
};

export const organizationsQueries = {
  ...createGenericQueries(organizationsService, 'organizations'),
  // ── Lectura ───────────────────────────────────────────────────

  useGetMembers: (
    organizationId: string,
    query?: GetMembersQuery,
    options?: Omit<UseQueryOptions<MemberListResponse, Error>, 'queryKey' | 'queryFn'>
  ) =>
    useQuery<MemberListResponse, Error>({
      queryKey: keys.list(organizationId, query),
      queryFn: () => organizationsService.getMembers(organizationId, query),
      enabled: !!organizationId && (options?.enabled ?? true),
      ...options,
    }),

  // ── Operaciones individuales ──────────────────────────────────

  useAddMembers: () => {
    const qc = useQueryClient();
    return useMutation<OrganizationMember, Error, { organizationId: string; body: CreateMember }>({
      mutationFn: ({ organizationId, body }) =>
        organizationsService.addMember(organizationId, body),
      onSuccess: (_, { organizationId }) => {
        qc.invalidateQueries({ queryKey: keys.all(organizationId) });
      },
    });
  },

  useRemoveMembers: () => {
    const qc = useQueryClient();
    return useMutation<OrganizationMember, Error, { organizationId: string; memberId: string }>({
      mutationFn: ({ organizationId, memberId }) =>
        organizationsService.removeMember(organizationId, memberId),
      onSuccess: (_, { organizationId }) => {
        qc.invalidateQueries({ queryKey: keys.all(organizationId) });
      },
    });
  },

  // ── Bulk ──────────────────────────────────────────────────────

  useAddMembersBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, { organizationId: string; body: BulkMemberIdsBody }>({
      mutationFn: ({ organizationId, body }) =>
        organizationsService.addMembersBulk(organizationId, body),
      onSuccess: (_, { organizationId }) => {
        qc.invalidateQueries({ queryKey: keys.all(organizationId) });
      },
    });
  },

  useRemoveMembersBulk: () => {
    const qc = useQueryClient();
    return useMutation<BulkResponse, Error, { organizationId: string; body: BulkMemberIdsBody }>({
      mutationFn: ({ organizationId, body }) =>
        organizationsService.removeMembersBulk(organizationId, body),
      onSuccess: (_, { organizationId }) => {
        qc.invalidateQueries({ queryKey: keys.all(organizationId) });
      },
    });
  },
};
