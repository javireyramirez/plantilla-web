import instance from '@/config/api';

export abstract class CrudService<
  TItem,
  TCreateBody = unknown,
  TUpdateBody = Partial<TCreateBody>,
  TQuery = Record<string, unknown>,
  TListQuery = Record<string, unknown>,
> {
  constructor(protected entityName: string) {}

  // ── Lectura ──────────────────────────────────────────────────

  getAll = async (query?: TQuery) => {
    const { data } = await instance.get(`/${this.entityName}/`, { params: query });
    return data;
  };

  getList = async (query?: TListQuery) => {
    const { data } = await instance.get(`/${this.entityName}/list`, { params: query });
    return data;
  };

  getById = async (id: string) => {
    const { data } = await instance.get(`/${this.entityName}/${id}`);
    return data;
  };

  // ── Escritura individual ──────────────────────────────────────

  create = async (body: TCreateBody) => {
    const { data } = await instance.post(`/${this.entityName}/`, body);
    return data;
  };

  update = async (id: string, body: TUpdateBody) => {
    const { data } = await instance.patch(`/${this.entityName}/${id}`, body);
    return data;
  };

  // ── Estados y borrado individual ──────────────────────────────

  softDelete = async (id: string) => {
    const { data } = await instance.delete(`/${this.entityName}/${id}`);
    return data;
  };

  restore = async (id: string) => {
    const { data } = await instance.patch(`/${this.entityName}/${id}/restore`);
    return data;
  };

  deletePermanent = async (id: string) => {
    const { data } = await instance.delete(`/${this.entityName}/${id}/permanent`);
    return data;
  };

  // ── Bulk ──────────────────────────────────────────────────────

  createMany = async (body: TCreateBody[]) => {
    const { data } = await instance.post(`/${this.entityName}/bulk`, body);
    return data;
  };

  softDeleteMany = async (ids: string[]) => {
    const { data } = await instance.delete(`/${this.entityName}/bulk`, { data: { ids } });
    return data;
  };

  restoreMany = async (ids: string[]) => {
    const { data } = await instance.patch(`/${this.entityName}/bulk/restore`, { ids });
    return data;
  };

  deletePermanentMany = async (ids: string[]) => {
    const { data } = await instance.delete(`/${this.entityName}/bulk/permanent`, { data: { ids } });
    return data;
  };
}
