import instance from '@/config/api';
import {
  CreateRole,
  GetListQueryType,
  GetRoleQuery,
  RoleListResponse,
  RoleResponse,
  UpdateRole,
} from '@/modules/roles/model/roles.schema';
import { CrudService } from '@/services/crud.service';

type Item = RoleResponse;
type CreateBody = CreateRole;
type UpdateBody = UpdateRole;
type QueryParams = GetRoleQuery;
type ListQueryParams = GetListQueryType;
type IdType = string;
type AllResponse = RoleListResponse;

class RolesService extends CrudService<
  Item,
  CreateBody,
  UpdateBody,
  QueryParams,
  ListQueryParams,
  IdType,
  AllResponse
> {
  constructor() {
    super('roles');
  }

  private getMembersPath(RoleId: string) {
    return `/roles/${RoleId}/members`;
  }
}

export const rolesService = new RolesService();
