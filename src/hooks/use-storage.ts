import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GetDocumentsQuery } from '@/schemas/storage.schema';
import storageService from '@/services/storage.service';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      file,
      files,
    }: {
      entityType: string;
      entityId: string;
      file?: File;
      files?: File[];
    }) => {
      // 1. Normalizamos la entrada a un array para procesarlos todos igual
      const filesToProcess = files || (file ? [file] : []);

      if (filesToProcess.length === 0) {
        throw new Error('No se han proporcionado archivos');
      }

      // 2. Mapeamos cada archivo a su promesa de subida completa (los 3 pasos)
      const uploadPromises = filesToProcess.map(async (currentFile) => {
        // Paso A: Pedir la URL
        const { uploadUrl, documentId } = await storageService.uploadUrl(entityType, entityId, {
          fileName: currentFile.name,
          mimeType: currentFile.type,
          size: currentFile.size,
          isPublic: false,
        });

        // Paso B: Subir al bucket
        await storageService.uploadBucket(uploadUrl, currentFile);

        // Paso C: Confirmar documento
        return await storageService.confirmDocument(entityType, entityId, documentId);
      });

      // 3. Ejecutamos todas las subidas en paralelo
      return await Promise.all(uploadPromises);
    },
    onSuccess: (_, { entityType, entityId }) => {
      // Invalida la caché una sola vez cuando terminen TODOS los archivos
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
  });
};

export const useGetDocuments = (entityType: string, entityId: string, query: GetDocumentsQuery) => {
  return useQuery({
    queryKey: ['documents', entityType, entityId, query],

    queryFn: () => storageService.getDocuments(entityType, entityId, query),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,
  });
};
