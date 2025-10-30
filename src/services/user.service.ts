import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface User {
  _id: string;
  phoneNumber: [string, string];
  email?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserData {
  email?: string;
  phoneNumber?: [string, string];
}

export const userService = {
  async getUser(id: string): Promise<{ user: User }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ user: User }>(API_ENDPOINTS.user.view(id), {
      method: 'GET',
      token: token || undefined,
    });
  },

  async updateUser(id: string, data: UpdateUserData): Promise<{ user: User }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ user: User }>(API_ENDPOINTS.user.update(id), {
      method: 'PUT',
      body: data,
      token: token || undefined,
    });
  },
};
