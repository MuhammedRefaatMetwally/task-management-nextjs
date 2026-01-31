import { apiClient, handleApiError } from './axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

export const tasksService = {
  async getAll(projectId?: string): Promise<Task[]> {
    try {
      const url = projectId 
        ? API_ENDPOINTS.TASKS.BY_PROJECT(projectId) 
        : API_ENDPOINTS.TASKS.LIST;
      const response = await apiClient.get<Task[]>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(API_ENDPOINTS.TASKS.GET(id));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async create(data: CreateTaskDto): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS.CREATE, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(API_ENDPOINTS.TASKS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};