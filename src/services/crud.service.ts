import instance from '@/config/api';

export abstract class CrudService<
  TItem,
  TCreateBody = unknown,
  TUpdateBody = Partial<TCreateBody>,
  TQuery = Record<string, unknown>,
  TListQuery = Record<string, unknown>,
  TId = string,
  TAllResponse = TItem[],
> {
  constructor(protected entityName: string) {}

  // ── Lectura ──────────────────────────────────────────────────

  getAll = async (query?: TQuery): Promise<TAllResponse> => {
    const { data } = await instance.get<TAllResponse>(`/${this.entityName}/`, { params: query });
    return data;
  };

  getList = async (query?: TListQuery): Promise<TItem[]> => {
    const { data } = await instance.get<TItem[]>(`/${this.entityName}/list`, { params: query });
    return data;
  };

  getById = async (id: TId): Promise<TItem> => {
    const { data } = await instance.get<TItem>(`/${this.entityName}/${id}`);
    return data;
  };

  // ── Escritura individual ──────────────────────────────────────

  create = async (body: TCreateBody): Promise<TItem> => {
    const { data } = await instance.post<TItem>(`/${this.entityName}/`, body);
    return data;
  };

  update = async (id: TId, body: TUpdateBody): Promise<TItem> => {
    const { data } = await instance.patch<TItem>(`/${this.entityName}/${id}`, body);
    return data;
  };

  // ── Estados y borrado individual ──────────────────────────────

  softDelete = async (id: TId): Promise<TItem> => {
    const { data } = await instance.delete<TItem>(`/${this.entityName}/${id}`);
    return data;
  };

  restore = async (id: TId): Promise<TItem> => {
    const { data } = await instance.patch<TItem>(`/${this.entityName}/${id}/restore`);
    return data;
  };

  deletePermanent = async (id: TId): Promise<void> => {
    const { data } = await instance.delete<void>(`/${this.entityName}/${id}/permanent`);
    return data;
  };

  // ── Bulk ──────────────────────────────────────────────────────

  createMany = async (body: TCreateBody[]): Promise<TItem[]> => {
    const { data } = await instance.post<TItem[]>(`/${this.entityName}/bulk`, body);
    return data;
  };

  softDeleteMany = async (ids: TId[]): Promise<TId[]> => {
    const { data } = await instance.delete<TId[]>(`/${this.entityName}/bulk`, { data: { ids } });
    return data;
  };

  restoreMany = async (ids: TId[]): Promise<TId[]> => {
    const { data } = await instance.patch<TId[]>(`/${this.entityName}/bulk/restore`, { ids });
    return data;
  };

  deletePermanentMany = async (ids: TId[]): Promise<void> => {
    const { data } = await instance.delete<void>(`/${this.entityName}/bulk/permanent`, {
      data: { ids },
    });
    return data;
  };
}
