// @/modules/roles/model/use-role-permissions-matrix.ts
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import * as React from 'react';

import { modulesQueries } from '@/modules/modules/model/modules.query';

import { rolesQueries } from './roles.query';
import { PermissionScopeType } from './roles.schema';

export function useRolePermissionsMatrix(roleId: string) {
  const { t } = useTranslation();

  // 1. Cargamos todos los módulos utilizando tu método genérico optimizado de listas (Retorna array plano)
  const { data: modules = [], isLoading: isLoadingModules } = modulesQueries.useGetList();

  // 2. Cargamos los permisos actuales asignados solucionando el error de tipado de TypeScript
  const { data: permissionsData, isLoading: isLoadingPermissions } = rolesQueries.useGetPermissions(
    roleId,
    {
      page: 1,
      limit: 1000, // Traemos todos para evitar cortes en la matriz
      sortBy: 'grantedAt',
      sortOrder: 'desc',
    }
  );
  const currentPermissions = permissionsData?.data ?? [];

  // 3. Mutaciones de la API
  const addPermissionMutation = rolesQueries.useAddPermission(roleId);
  const revokePermissionMutation = rolesQueries.useRevokePermission(roleId);
  const updateScopeMutation = rolesQueries.useUpdatePermissionScope(roleId, '');

  const isLoading = isLoadingModules || isLoadingPermissions;

  // Helper para buscar si existe un permiso asignado comparando el moduleId
  const getPermissionCell = React.useCallback(
    (moduleId: string, action: string) => {
      return currentPermissions.find((p) => p.moduleId === moduleId && p.action === action);
    },
    [currentPermissions]
  );

  // Manejador del cambio de Scope en el Dropdown
  const handleScopeChange = async (
    moduleId: string,
    action: string,
    newScope: PermissionScopeType | 'NONE'
  ) => {
    const existingPermission = getPermissionCell(moduleId, action);

    try {
      // CASO 1: Se selecciona 'NONE' -> Se revoca/elimina el permiso
      if (newScope === 'NONE') {
        if (existingPermission) {
          await revokePermissionMutation.mutateAsync(existingPermission.id);
          toast.success(
            t('roles.permissions.revoked', { defaultValue: 'Permiso revocado correctamente' })
          );
        }
        return;
      }

      // CASO 2: No existía el permiso -> Se crea con el scope seleccionado
      if (!existingPermission) {
        await addPermissionMutation.mutateAsync({
          moduleId,
          action,
          scope: newScope,
        });
        toast.success(t('roles.permissions.granted', { defaultValue: 'Permiso concedido' }));
        return;
      }

      // CASO 3: Ya existía -> Se actualiza el scope (GLOBAL, TEAM, OWN)
      if (existingPermission.scope !== newScope) {
        await updateScopeMutation.mutateAsync({
          ...existingPermission,
          id: existingPermission.id,
          scope: newScope,
          moduleId,
          action,
        } as any);
        toast.success(t('roles.permissions.updated', { defaultValue: 'Alcance actualizado' }));
      }
    } catch (error) {
      toast.error(
        t('roles.permissions.error', { defaultValue: 'Error al modificar los permisos' })
      );
    }
  };

  return {
    modules,
    isLoading,
    getPermissionCell,
    handleScopeChange,
    isMutating:
      addPermissionMutation.isPending ||
      revokePermissionMutation.isPending ||
      updateScopeMutation.isPending,
  };
}
