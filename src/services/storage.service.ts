import axios from 'axios';

import instance from '@/config/api';
import { RequestUploadParams } from '@/schemas/storage.schema';

class StorageService {
  uploadUrl = async (entityType: string, entityId: string, data: RequestUploadParams) => {
    try {
      const response = await instance.post(`/storage/${entityType}/${entityId}/upload-url`, {
        fileData: data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  uploadBucket = async (uploadUrl: string, file: File) => {
    try {
      const response = await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.status;
    } catch (error) {
      throw error;
    }
  };

  confirmDocument = async (entityType: string, entityId: string, documentId: string) => {
    try {
      const response = await instance.patch(
        `/storage/${entityType}/${entityId}/${documentId}/confirm-document`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  downloadUrl = async (entityType: string, entityId: string, documentId: string) => {
    try {
      const response = await instance.get(
        `/storage/${entityType}/${entityId}/${documentId}/download-url`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  deleteSoftDocument = async (entityType: string, entityId: string, documentId: string) => {
    try {
      const response = await instance.patch(
        `/storage/${entityType}/${entityId}/${documentId}/delete-soft-document`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  restoreDocument = async (entityType: string, entityId: string, documentId: string) => {
    try {
      const response = await instance.patch(
        `/storage/${entityType}/${entityId}/${documentId}/restore-document`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  deleteDocument = async (entityType: string, entityId: string, documentId: string) => {
    try {
      const response = await instance.delete(
        `/storage/${entityType}/${entityId}/${documentId}/delete-document`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  getDocuments = async (entityType: string, entityId: string, isTrash: boolean) => {
    try {
      const response = await instance.get(`/storage/${entityType}/${entityId}/documents`, {
        params: {
          isTrash,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default new StorageService();
