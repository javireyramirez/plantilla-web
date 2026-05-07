import { toast } from 'sonner';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GetDocumentsQuery } from '@/schemas/storage.schema';
import storageService from '@/services/storage.service';

// O tu librería de notificaciones

// ==========================================
// 1. CONSULTAS Y LECTURA
// ==========================================

export const useGetDocuments = (entityType: string, entityId: string, query: GetDocumentsQuery) => {
  return useQuery({
    queryKey: ['documents', entityType, entityId, query],
    queryFn: () => storageService.getDocuments(entityType, entityId, query),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetDocumentDetail = (entityType: string, entityId: string, documentId: string) => {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => storageService.getDocumentDetail(entityType, entityId, documentId),
    enabled: !!documentId,
  });
};

// ==========================================
// 2. CICLO DE VIDA DE SUBIDA (UPLOAD)
// ==========================================

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
      const filesToProcess = files || (file ? [file] : []);
      if (filesToProcess.length === 0) throw new Error('No se han proporcionado archivos');

      const uploadPromises = filesToProcess.map(async (currentFile) => {
        // Paso A: Pedir URL
        const { uploadUrl, documentId } = await storageService.requestUploadUrl(
          entityType,
          entityId,
          {
            fileName: currentFile.name,
            mimeType: currentFile.type,
            size: currentFile.size,
            isPublic: false,
          }
        );

        // Paso B: Subir al bucket
        await storageService.uploadToBucket(uploadUrl, currentFile);

        // Paso C: Confirmar
        return await storageService.confirmDocument(entityType, entityId, documentId);
      });

      return await Promise.all(uploadPromises);
    },
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Archivos subidos correctamente');
    },
  });
};

// ==========================================
// 3. EDICIÓN Y ESTADOS (INDIVIDUAL)
// ==========================================

export const useUpdateDocumentMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentId,
      data,
    }: {
      entityType: string;
      entityId: string;
      documentId: string;
      data: { fileName?: string; isPublic?: boolean };
    }) => storageService.updateMetadata(entityType, entityId, documentId, data),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
  });
};

export const useDeleteSoftDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentId,
    }: {
      entityType: string;
      entityId: string;
      documentId: string;
    }) => storageService.deleteSoftDocument(entityType, entityId, documentId),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Documento movido a la papelera');
    },
  });
};

export const useRestoreDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentId,
    }: {
      entityType: string;
      entityId: string;
      documentId: string;
    }) => storageService.restoreDocument(entityType, entityId, documentId),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Documento restaurado');
    },
  });
};

// ==========================================
// 4. ACCIONES MASIVAS (BULK)
// ==========================================

export const useBulkDeleteDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentIds,
    }: {
      entityType: string;
      entityId: string;
      documentIds: string[];
    }) => storageService.bulkDelete(entityType, entityId, documentIds),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Documentos movidos a la papelera');
    },
  });
};

export const useBulkRestoreDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentIds,
    }: {
      entityType: string;
      entityId: string;
      documentIds: string[];
    }) => storageService.bulkRestore(entityType, entityId, documentIds),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Documentos restaurados');
    },
  });
};

// ==========================================
// 5. MANTENIMIENTO Y ELIMINACIÓN FÍSICA
// ==========================================

export const useEmptyTrash = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityType, entityId }: { entityType: string; entityId: string }) =>
      storageService.emptyTrash(entityType, entityId),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Papelera vaciada');
    },
  });
};

export const useDeletePermanentDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      documentId,
    }: {
      entityType: string;
      entityId: string;
      documentId: string;
    }) => storageService.deletePermanent(entityType, entityId, documentId),
    onSuccess: (_, { entityType, entityId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      toast.success('Documento eliminado permanentemente');
    },
  });
};
