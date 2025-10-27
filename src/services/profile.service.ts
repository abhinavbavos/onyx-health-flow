import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Profile {
  _id: string;
  userId: string;
  name: string;
  dob: string;
  height: number;
  weight: number;
  blood_group: string;
  phone_number: [string, string];
  email: string;
  bmi: number;
  status?: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateProfileData {
  name: string;
  dob: string;
  height: number;
  weight: number;
  blood_group: string;
  phone_number: [string, string];
  email: string;
  bmi: number;
}

interface UpdateProfileData {
  name?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  email?: string;
}

export const profileService = {
  async createProfile(data: CreateProfileData): Promise<{ profile: Profile }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ profile: Profile }>(API_ENDPOINTS.profile.create, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async getProfiles(): Promise<{ profiles: Profile[] }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ profiles: Profile[] }>(API_ENDPOINTS.profile.list, {
      method: 'GET',
      token: token || undefined,
    });
  },

  async getProfile(id: string): Promise<{ profile: Profile }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ profile: Profile }>(API_ENDPOINTS.profile.view(id), {
      method: 'GET',
      token: token || undefined,
    });
  },

  async updateProfile(id: string, data: UpdateProfileData): Promise<{ profile: Profile }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ profile: Profile }>(API_ENDPOINTS.profile.update(id), {
      method: 'PUT',
      body: data,
      token: token || undefined,
    });
  },

  async deleteProfile(id: string): Promise<{ message: string }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ message: string }>(API_ENDPOINTS.profile.delete(id), {
      method: 'DELETE',
      token: token || undefined,
    });
  },
};
