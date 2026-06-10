import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useEffect } from 'react';

import { teamsQueries } from './teams.query';
import { CreateTeam, CreateTeamBodySchema, UpdateTeam } from './teams.schema';

export function useTeamForm(id?: string) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = !!id;

  const { data, isLoading, isFetching } = teamsQueries.useGetById(id as string, {
    enabled: isEditing,
  });

  const { mutate: create, isPending: isCreating } = teamsQueries.useCreate();
  const { mutate: update, isPending: isUpdating } = teamsQueries.useUpdate();
  const { mutate: softDelete, isPending: isDeleting } = teamsQueries.useSoftDelete();

  const handleSubmit = (formData: CreateTeam | UpdateTeam, options?: { shouldClose?: boolean }) => {
    const { ...clean } = formData;
    const shouldClose = options?.shouldClose ?? false;

    if (isEditing) {
      update(
        { id, body: clean as UpdateTeam },
        {
          onSuccess: () => {
            toast.success(t('teams.form.update'));
            if (shouldClose) navigate('/teams');
          },
          onError: (error: any) => {
            const serverMessage = error?.response?.data?.message || error?.message;
            toast.error(serverMessage || t('teams.form.errors.update'));
          },
        }
      );
    } else {
      create(clean as CreateTeam, {
        onSuccess: (newTeam) => {
          toast.success(t('teams.form.create'));

          if (shouldClose) {
            navigate('/teams');
          } else if (newTeam?.id) {
            navigate(`/teams/edit/${newTeam.id}`);
          } else {
            navigate('/teams');
          }
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message || error?.message;
          toast.error(serverMessage || t('teams.form.errors.create'));
        },
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;

    softDelete(id, {
      onSuccess: () => {
        toast.success(t('teams.form.delete'));
        navigate('/teams');
      },
      onError: (error: any) => {
        const serverMessage = error?.response?.data?.message || error?.message;
        toast.error(serverMessage || t('teams.form.errors.delete'));
      },
    });
  };

  const form = useForm<CreateTeam>({
    resolver: zodResolver(CreateTeamBodySchema),
    mode: 'onBlur',
    defaultValues: data ?? { name: '' },
  });

  // --- Sincronización del formulario con el backend ---
  useEffect(() => {
    if (isEditing) {
      if (!isLoading && !isFetching && data) {
        form.reset(data);
      }
    } else {
      form.reset({ name: '' });
    }
  }, [isEditing, data, isLoading, isFetching, form]);

  const teamName = useWatch({ control: form.control, name: 'name' });

  return {
    data,
    isEditing,
    teamName,
    isLoading,
    form,
    handleSubmit,
    handleDelete,
    isPending: isCreating || isUpdating || isDeleting,
  };
}
