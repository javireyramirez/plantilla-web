import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { companiesQueries } from './companies.query';
import { CreateCompany, UpdateCompany } from './companies.schema';

export function useCompanyForm(id?: string) {
  const { t } = useTranslation();
  const isEditing = !!id;

  const { data, isLoading } = isEditing
    ? companiesQueries.useGetById(id)
    : { data: undefined, isLoading: false };

  const { mutate: create, isPending: isCreating } = companiesQueries.useCreate();
  const { mutate: update, isPending: isUpdating } = companiesQueries.useUpdate();

  const handleSubmit = (formData: CreateCompany | UpdateCompany) => {
    if (isEditing) {
      update(
        { id, body: formData as UpdateCompany },
        { onSuccess: () => toast.success(t('companies.form.update')) }
      );
    } else {
      create(formData as CreateCompany, {
        onSuccess: () => toast.success(t('companies.form.create')),
      });
    }
  };

  return {
    isEditing,
    defaultValues: data,
    isLoading,
    handleSubmit,
    isPending: isCreating || isUpdating,
  };
}
