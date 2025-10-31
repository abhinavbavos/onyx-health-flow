import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './api-config';

interface ApiRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
};

export const apiRequest = async <T = any>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const { requiresAuth = true, headers = {}, ...restConfig } = config;

  const requestConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restConfig,
  };

  // Add Authorization header if auth is required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response: AxiosResponse<T> = await axios(requestConfig);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle 401 errors by clearing token
      if (error.response?.status === 401) {
        clearAuthToken();
        window.location.href = '/login';
      }
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};
