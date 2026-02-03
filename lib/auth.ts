import { STORAGE_KEYS } from '@/config/api.config';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};