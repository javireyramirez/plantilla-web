// @/modules/roles/components/role-permissions-matrix.tsx
import { Loader2, Shield, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { PermissionScopeType } from '../model/roles.schema';
import { useRolePermissionsMatrix } from '../model/use-role-permissions-matrix';

const ACTIONS = [
  'READ',
  'CREATE',
  'UPDATE',
  'DELETE',
  'RESTORE',
  'EXPORT',
  'IMPORT',
  'SETTINGS',
] as const;

interface RolePermissionsMatrixProps {
  roleId: string;
}

export function RolePermissionsMatrix({ roleId }: RolePermissionsMatrixProps) {
  const { t } = useTranslation();
  const {
    modules,
    isLoading,
    getEffectiveScope,
    setPendingScope,
    handleSave,
    handleCancel,
    hasChanges,
    isSaving,
    isMutating,
  } = useRolePermissionsMatrix(roleId);

  if (isLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {t('roles.permissions.loading', { defaultValue: 'Cargando matriz de permisos...' })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold">
              {t('roles.permissions.matrixTitle', { defaultValue: 'Matriz de Permisos' })}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('roles.permissions.matrixDesc', {
                defaultValue:
                  'Asigna el nivel de acceso para cada acción sobre los recursos del sistema.',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="text-xs h-8"
              >
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs h-8 gap-1.5"
              >
                {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                {t('common.save', { defaultValue: 'Guardar' })}
              </Button>
            </>
          )}
          {isMutating && !hasChanges && (
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 text-xs animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {isSaving
                ? t('roles.permissions.saving', { defaultValue: 'Guardando...' })
                : t('roles.permissions.saving', { defaultValue: 'Sincronizando...' })}
            </Badge>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[220px] font-bold text-foreground">
                {t('roles.permissions.moduleCol', { defaultValue: 'Módulo / Recurso' })}
              </TableHead>
              {ACTIONS.map((action) => (
                <TableHead key={action} className="text-center min-w-[120px] font-medium text-xs">
                  {action}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={ACTIONS.length + 1} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-sm">
                      {t('roles.permissions.noModules', {
                        defaultValue: 'No se encontraron módulos disponibles.',
                      })}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              modules.map((mod: any) => {
                const moduleName = mod.name || t('roles.permissions.unknownModule');

                return (
                  <TableRow key={mod.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium min-w-[200px]">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{moduleName}</span>
                      </div>
                    </TableCell>

                    {ACTIONS.map((action) => {
                      const currentValue = getEffectiveScope(mod.id, action);

                      return (
                        <TableCell key={action} className="p-2 text-center">
                          <Select
                            disabled={isSaving}
                            value={currentValue}
                            onValueChange={(val) =>
                              setPendingScope(mod.id, action, val as PermissionScopeType | 'NONE')
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                'h-8 w-full text-xs font-medium border-dashed bg-transparent transition-all',
                                currentValue === 'NONE' &&
                                  'text-muted-foreground border-transparent hover:border-input',
                                currentValue === 'OWN' &&
                                  'border-blue-200 text-blue-600 bg-blue-50/30 dark:bg-blue-950/20',
                                currentValue === 'TEAM' &&
                                  'border-purple-200 text-purple-600 bg-purple-50/30 dark:bg-purple-950/20',
                                currentValue === 'GLOBAL' &&
                                  'border-emerald-200 text-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20'
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="center">
                              <SelectItem
                                value="NONE"
                                className="text-xs text-muted-foreground focus:text-destructive"
                              >
                                ✕ {t('roles.scopes.none', { defaultValue: 'Ninguno' })}
                              </SelectItem>
                              <SelectItem value="OWN" className="text-xs text-blue-600">
                                🔒 {t('roles.scopes.own', { defaultValue: 'Usuario' })}
                              </SelectItem>
                              <SelectItem value="TEAM" className="text-xs text-purple-600">
                                👥 {t('roles.scopes.team', { defaultValue: 'Equipo' })}
                              </SelectItem>
                              <SelectItem value="GLOBAL" className="text-xs text-emerald-600">
                                🌐 {t('roles.scopes.global', { defaultValue: 'Global' })}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
