import axios from 'axios';

import instance from '@/config/api';
import { RequestUploadParams } from '@/schemas/storage.schema';

class StorageService {
  uploadUrl = async (entityType: string, entityId: string, data: RequestUploadParams) => {
    const response = await instance.post(`/storage/${entityType}/${entityId}/upload-url`, {
      fileData: data,
    });
    return response.data;
  };

  uploadBucket = async (uploadUrl: string, file: File) => {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    return response.status;
  };

  confirmDocument = async (entityType: string, entityId: string, documentId: string) => {
    const response = await instance.patch(
      `/storage/${entityType}/${entityId}/${documentId}/confirm-document`
    );
    return response.data;
  };

  downloadUrl = async (entityType: string, entityId: string, documentId: string) => {
    const response = await instance.get(
      `/storage/${entityType}/${entityId}/${documentId}/download-url`
    );
    return response.data;
  };

  deleteSoftDocument = async (entityType: string, entityId: string, documentId: string) => {
    const response = await instance.patch(
      `/storage/${entityType}/${entityId}/${documentId}/delete-soft-document`
    );
    return response.data;
  };

  restoreDocument = async (entityType: string, entityId: string, documentId: string) => {
    const response = await instance.patch(
      `/storage/${entityType}/${entityId}/${documentId}/restore-document`
    );
    return response.data;
  };

  deleteDocument = async (entityType: string, entityId: string, documentId: string) => {
    const response = await instance.delete(
      `/storage/${entityType}/${entityId}/${documentId}/delete-document`
    );
    return response.data;
  };

  getDocuments = async (
    entityType: string,
    entityId: string,
    isTrash: boolean = false,
    page: number,
    limit: number,
    fileName: string,
    contentType: string
  ) => {
    const response = await instance.get(`/storage/${entityType}/${entityId}/documents`, {
      params: {
        isTrash,
        page,
        limit,
        ...(fileName && { fileName }),
        ...(contentType && { contentType }),
      },
    });
    return response.data;
  };
}

export default new StorageService();
