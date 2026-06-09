import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useEffect } from 'react';

import { teamsQueries } from './teams.query';
import { CreateTeam, CreateTeamBodySchema, UpdateTeam } from './teams.schema';

export function useCompanyForm(id?: string) {
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
            toast.success(t('companies.form.update'));
            if (shouldClose) navigate('/companies');
          },
          onError: (error: any) => {
            const serverMessage = error?.response?.data?.message || error?.message;
            toast.error(serverMessage || t('companies.form.errors.update'));
          },
        }
      );
    } else {
      create(clean as CreateTeam, {
        onSuccess: (newCompany) => {
          toast.success(t('companies.form.create'));

          if (shouldClose) {
            navigate('/companies');
          } else if (newCompany?.id) {
            navigate(`/companies/edit/${newCompany.id}`);
          } else {
            navigate('/companies');
          }
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message || error?.message;
          toast.error(serverMessage || t('companies.form.errors.create'));
        },
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;

    softDelete(id, {
      onSuccess: () => {
        toast.success(t('companies.form.delete'));
        navigate('/companies');
      },
      onError: (error: any) => {
        const serverMessage = error?.response?.data?.message || error?.message;
        toast.error(serverMessage || t('companies.form.errors.delete'));
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

  const companyName = useWatch({ control: form.control, name: 'name' });

  return {
    isEditing,
    companyName,
    isLoading,
    form,
    handleSubmit,
    handleDelete,
    isPending: isCreating || isUpdating || isDeleting,
  };
}
