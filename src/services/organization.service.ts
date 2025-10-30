import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Organization {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrganizationData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const organizationService = {
  async createOrganization(data: CreateOrganizationData): Promise<{ organization: Organization }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ organization: Organization }>(API_ENDPOINTS.organization.create, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async listOrganizations(): Promise<{ organizations: Organization[] }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ organizations: Organization[] }>(API_ENDPOINTS.organization.list, {
      method: 'GET',
      token: token || undefined,
    });
  },

  async getOrganization(id: string): Promise<{ organization: Organization }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ organization: Organization }>(API_ENDPOINTS.organization.view(id), {
      method: 'GET',
      token: token || undefined,
    });
  },

  async deleteOrganization(id: string): Promise<{ message: string }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ message: string }>(API_ENDPOINTS.organization.delete(id), {
      method: 'DELETE',
      token: token || undefined,
    });
  },
};
