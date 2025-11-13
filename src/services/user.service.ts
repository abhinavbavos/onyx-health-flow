import { apiRequest } from '@/lib/api-request';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface User {
  id: string;
  [key: string]: any;
}

export const viewUser = async (id: string): Promise<User> => {
  return apiRequest(API_ENDPOINTS.USER.VIEW(id), {
    method: 'GET',
  });
};

export const updateUser = async (id: string, data: any): Promise<User> => {
  return apiRequest(API_ENDPOINTS.USER.UPDATE(id), {
    method: 'PUT',
    data,
  });
};

export const listUsers = async (): Promise<User[]> => {
  const endpoint = (API_ENDPOINTS.USER as any).LIST ?? '/users';
  return apiRequest(endpoint, {
    method: 'GET',
  });
};