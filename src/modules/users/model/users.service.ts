import instance from '@/config/api';
import {
  CreateUsers,
  GetListQueryType,
  GetUsersQuery,
  UpdateUsers,
  UsersListResponse,
  UsersResponse,
} from '@/modules/users/model/users.schema';
import { CrudService } from '@/services/crud.service';

type Item = UsersResponse;
type CreateBody = CreateUsers;
type UpdateBody = UpdateUsers;
type QueryParams = GetUsersQuery;
type ListQueryParams = GetListQueryType;
type IdType = string;
type AllResponse = UsersListResponse;

class UsersService extends CrudService<
  Item,
  CreateBody,
  UpdateBody,
  QueryParams,
  ListQueryParams,
  IdType,
  AllResponse
> {
  constructor() {
    super('users');
  }

  private getMembersPath(UsersId: string) {
    return `/users/${UsersId}/members`;
  }
}

export const usersService = new UsersService();
