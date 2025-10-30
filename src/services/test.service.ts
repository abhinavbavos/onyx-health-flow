import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Test {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AddTestData {
  name: string;
  description?: string;
}

export const testService = {
  async addTest(data: AddTestData): Promise<{ test: Test }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ test: Test }>(API_ENDPOINTS.test.add, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async listTests(): Promise<{ tests: Test[] }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ tests: Test[] }>(API_ENDPOINTS.test.list, {
      method: 'GET',
      token: token || undefined,
    });
  },
};
