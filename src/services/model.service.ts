import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Model {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddModelData {
  name: string;
  description?: string;
}

export const modelService = {
  async addModel(data: AddModelData): Promise<{ model: Model }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ model: Model }>(API_ENDPOINTS.model.add, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },
};
