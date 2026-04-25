import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import storageService from '@/services/storage.service';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      file,
    }: {
      entityType: string;
      entityId: string;
      file: File;
    }) => {
      const { uploadUrl, documentId } = await storageService.uploadUrl(entityType, entityId, {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        isPublic: false,
      });
      await storageService.uploadBucket(uploadUrl, file);
      return await storageService.confirmDocument(entityType, entityId, documentId);
    },
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
  });
};

export const useGetDocuments = (entityType: string, entityId: string, isTrash: boolean) => {
  return useQuery({
    queryKey: ['documents', entityType, entityId, isTrash],
    queryFn: () => storageService.getDocuments(entityType, entityId, isTrash),
  });
};
