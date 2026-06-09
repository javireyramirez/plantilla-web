import instance from '@/config/api';
import { CrudService } from '@/services/crud.service';

import {
  BulkMemberIdsBody,
  BulkResponse,
  BulkToggleMemberStatus,
  CreateMember,
  CreateOrganization,
  GetListQuery,
  GetMembersQuery,
  GetOrganizationQuery,
  MemberListResponse,
  Organization,
  OrganizationListResponse,
  OrganizationMember,
  ToggleMemberStatus,
  UpdateOrganization,
} from './organizations.schema';

type Item = Organization;
type CreateBody = CreateOrganization;
type UpdateBody = UpdateOrganization;
type QueryParams = GetOrganizationQuery;
type ListQueryParams = GetListQuery;
type IdType = string;
type AllResponse = OrganizationListResponse;

class OrganizationsService extends CrudService<
  Item,
  CreateBody,
  UpdateBody,
  QueryParams,
  ListQueryParams,
  IdType,
  AllResponse
> {
  constructor() {
    super('organizations');
  }

  private getMembersPath(organizationId: string) {
    return `/organizations/${organizationId}/members`;
  }

  // ── Lectura ────────────────────────────────
  getMembers = async (organizationId: string, query?: GetMembersQuery) => {
    const { data } = await instance.get<MemberListResponse>(this.getMembersPath(organizationId), {
      params: query,
    });
    return data;
  };

  // ── Escritura individual ───────────────────
  addMember = async (organizationId: string, body: CreateMember) => {
    const { data } = await instance.post<OrganizationMember>(
      this.getMembersPath(organizationId),
      body
    );
    return data;
  };

  removeMember = async (organizationId: string, memberId: string) => {
    const { data } = await instance.delete<OrganizationMember>(
      `${this.getMembersPath(organizationId)}/${memberId}`
    );
    return data;
  };

  statusMember = async (organizationId: string, memberId: string, body: ToggleMemberStatus) => {
    const { data } = await instance.patch<OrganizationMember>(
      `${this.getMembersPath(organizationId)}/${memberId}/status`,
      body
    );
    return data;
  };

  // ── Bulk ───────────────────────────────────
  addMembersBulk = async (organizationId: string, body: BulkMemberIdsBody) => {
    const { data } = await instance.post<BulkResponse>(
      `${this.getMembersPath(organizationId)}/bulk`,
      body
    );
    return data;
  };

  removeMembersBulk = async (organizationId: string, body: BulkMemberIdsBody) => {
    const { data } = await instance.delete<BulkResponse>(
      `${this.getMembersPath(organizationId)}/bulk`,
      {
        data: body,
      }
    );
    return data;
  };

  statusMemberBulk = async (organizationId: string, body: BulkToggleMemberStatus) => {
    const { data } = await instance.patch<OrganizationMember>(
      `${this.getMembersPath(organizationId)}/bulk/status`,
      body
    );
    return data;
  };
}

export const organizationsService = new OrganizationsService();
