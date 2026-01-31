import { apiClient, handleApiError } from './axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginDto, RegisterDto, AuthResponse, User } from '@/types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      return response.data as AuthResponse;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};