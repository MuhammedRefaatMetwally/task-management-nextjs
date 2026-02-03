import { apiClient, handleApiError } from './axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { User } from '@/types';

export const usersService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.USERS.GET(id));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch<User>(API_ENDPOINTS.USERS.UPDATE_ME, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async uploadAvatar(file: File): Promise<{ url: string; publicId: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ url: string; publicId: string }>(
        API_ENDPOINTS.UPLOAD.AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};