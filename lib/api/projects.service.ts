import { apiClient, handleApiError } from './axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.GET(id));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async create(data: CreateProjectDto): Promise<Project> {
    try {
      const response = await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    try {
      const response = await apiClient.patch<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};