import instance from '@/config/api';
import { CrudService } from '@/services/crud.service';

import {
  BulkMemberIdsBody,
  BulkResponse,
  CreateTeam,
  CreateTeamMember,
  GetListQueryType,
  GetTeamMembersQuery,
  GetTeamQuery,
  TeamListResponse,
  TeamMember,
  TeamMemberListResponse,
  TeamResponse,
  UpdateTeam,
} from './teams.schema';

type Item = TeamResponse;
type CreateBody = CreateTeam;
type UpdateBody = UpdateTeam;
type QueryParams = GetTeamQuery;
type ListQueryParams = GetListQueryType;
type IdType = string;
type AllResponse = TeamListResponse;

class TeamsService extends CrudService<
  Item,
  CreateBody,
  UpdateBody,
  QueryParams,
  ListQueryParams,
  IdType,
  AllResponse
> {
  constructor() {
    super('teams');
  }

  private getMembersPath(teamId: string) {
    return `/teams/${teamId}/members`;
  }

  // ── Lectura ────────────────────────────────
  getMembers = async (teamId: string, query?: GetTeamMembersQuery) => {
    const { data } = await instance.get<TeamMemberListResponse>(this.getMembersPath(teamId), {
      params: query,
    });
    return data;
  };

  // ── Escritura individual ───────────────────
  addMember = async (teamId: string, body: CreateTeamMember) => {
    const { data } = await instance.post<TeamMember>(this.getMembersPath(teamId), body);
    return data;
  };

  removeMember = async (teamId: string, memberId: string) => {
    const { data } = await instance.delete<TeamMember>(
      `${this.getMembersPath(teamId)}/${memberId}`
    );
    return data;
  };

  // ── Bulk ───────────────────────────────────
  addMembersBulk = async (teamId: string, body: BulkMemberIdsBody) => {
    const { data } = await instance.post<BulkResponse>(`${this.getMembersPath(teamId)}/bulk`, body);
    return data;
  };

  removeMembersBulk = async (teamId: string, body: BulkMemberIdsBody) => {
    const { data } = await instance.delete<BulkResponse>(`${this.getMembersPath(teamId)}/bulk`, {
      data: body,
    });
    return data;
  };
}

export const teamsService = new TeamsService();
