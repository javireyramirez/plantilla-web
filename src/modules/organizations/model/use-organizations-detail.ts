import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useEffect } from 'react';

import { slugify } from '@/lib/utils';

import { organizationsQueries } from './organizations.query';
import {
  CreateOrganization,
  CreateOrganizationBodySchema,
  UpdateOrganization,
} from './organizations.schema';

export function useOrganizationForm(id?: string) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = !!id;

  const { data, isLoading, isFetching } = organizationsQueries.useGetById(id as string, {
    enabled: isEditing,
  });

  const { mutate: create, isPending: isCreating } = organizationsQueries.useCreate();
  const { mutate: update, isPending: isUpdating } = organizationsQueries.useUpdate();
  const { mutate: softDelete, isPending: isDeleting } = organizationsQueries.useSoftDelete();

  const handleSubmit = (
    formData: CreateOrganization | UpdateOrganization,
    options?: { shouldClose?: boolean }
  ) => {
    const shouldClose = options?.shouldClose ?? false;
    const payload = {
      ...formData,
      slug: slugify(formData.name),
    };

    if (isEditing) {
      update(
        { id, body: payload as UpdateOrganization },
        {
          onSuccess: () => {
            toast.success(t('organizations.form.update'));
            if (shouldClose) navigate('/organizations');
          },
          onError: (error: any) => {
            const serverMessage = error?.response?.data?.message || error?.message;
            toast.error(serverMessage || t('organizations.form.errors.update'));
          },
        }
      );
    } else {
      create(payload as CreateOrganization, {
        onSuccess: (newOrganization) => {
          toast.success(t('organizations.form.create'));

          if (shouldClose) {
            navigate('/organizations');
          } else if (newOrganization?.id) {
            navigate(`/organizations/edit/${newOrganization.id}`);
          } else {
            navigate('/organizations');
          }
        },
        onError: (error: any) => {
          const serverMessage = error?.response?.data?.message || error?.message;
          toast.error(serverMessage || t('organizations.form.errors.create'));
        },
      });
    }
  };

  const handleDelete = () => {
    if (!id) return;

    softDelete(id, {
      onSuccess: () => {
        toast.success(t('organizations.form.delete'));
        navigate('/organizations');
      },
      onError: (error: any) => {
        const serverMessage = error?.response?.data?.message || error?.message;
        toast.error(serverMessage || t('organizations.form.errors.delete'));
      },
    });
  };

  const form = useForm<CreateOrganization>({
    resolver: zodResolver(CreateOrganizationBodySchema),
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

  const organizationName = useWatch({ control: form.control, name: 'name' });

  return {
    isEditing,
    organizationName,
    isLoading,
    form,
    handleSubmit,
    handleDelete,
    isPending: isCreating || isUpdating || isDeleting,
  };
}
