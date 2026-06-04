import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { companiesQueries } from './companies.query';
import { CreateCompany, UpdateCompany } from './companies.schema';

export function useCompanyForm(id?: string) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = !!id;

  const { data, isLoading, isFetching } = companiesQueries.useGetById(id as string, {
    enabled: isEditing,
  });

  const { mutate: create, isPending: isCreating } = companiesQueries.useCreate();
  const { mutate: update, isPending: isUpdating } = companiesQueries.useUpdate();
  const { mutate: softDelete, isPending: isDeleting } = companiesQueries.useSoftDelete();

  const handleSubmit = (
    formData: CreateCompany | UpdateCompany,
    options?: { shouldClose?: boolean }
  ) => {
    const { owner, ownerTeam, ownerOrganization, ...clean } = formData;
    const shouldClose = options?.shouldClose ?? false;

    if (isEditing) {
      update(
        { id, body: clean as UpdateCompany },
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
      create(clean as CreateCompany, {
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

  return {
    isEditing,
    defaultValues: data,
    isLoading,
    isFetching,
    handleSubmit,
    handleDelete,
    isPending: isCreating || isUpdating || isDeleting,
  };
}
