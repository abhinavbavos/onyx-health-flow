import { apiRequest } from '@/lib/api-request';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface Organization {
  id: string;
  [key: string]: any;
}

export const createOrganization = async (data: any): Promise<Organization> => {
  return apiRequest(API_ENDPOINTS.ORGANIZATION.CREATE, {
    method: 'POST',
    data,
  });
};

export const listOrganizations = async (): Promise<Organization[]> => {
  return apiRequest(API_ENDPOINTS.ORGANIZATION.LIST, {
    method: 'GET',
  });
};

export const viewOrganization = async (id: string): Promise<Organization> => {
  return apiRequest(API_ENDPOINTS.ORGANIZATION.VIEW(id), {
    method: 'GET',
  });
};

export const deleteOrganization = async (id: string): Promise<void> => {
  return apiRequest(API_ENDPOINTS.ORGANIZATION.DELETE(id), {
    method: 'DELETE',
  });
};
