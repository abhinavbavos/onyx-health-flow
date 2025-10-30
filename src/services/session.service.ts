import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

type SessionStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

interface Session {
  _id: string;
  userId: string;
  profileId: string | any;
  productId: string | any;
  testIds: any[];
  scheduledAt: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

interface CreateSessionData {
  profileId: string;
  testIds: string[];
  productId: string;
}

export const sessionService = {
  async createSession(data: CreateSessionData): Promise<{ session: Session }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ session: Session }>(API_ENDPOINTS.session.create, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async getSessions(status?: SessionStatus): Promise<{ sessions: Session[] }> {
    const token = tokenManager.getAccessToken();
    const endpoint = status 
      ? `${API_ENDPOINTS.session.list}?status=${status}`
      : API_ENDPOINTS.session.list;
    
    return apiRequest<{ sessions: Session[] }>(endpoint, {
      method: 'GET',
      token: token || undefined,
    });
  },

  async getSession(id: string): Promise<{ session: Session }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ session: Session }>(API_ENDPOINTS.session.view(id), {
      method: 'GET',
      token: token || undefined,
    });
  },

  async updateSession(id: string, data: Partial<CreateSessionData>): Promise<{ session: Session }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ session: Session }>(API_ENDPOINTS.session.update(id), {
      method: 'PUT',
      body: data,
      token: token || undefined,
    });
  },

  async deleteSession(id: string): Promise<{ message: string }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ message: string }>(API_ENDPOINTS.session.delete(id), {
      method: 'DELETE',
      token: token || undefined,
    });
  },

  async addSessionItemResult(data: any): Promise<{ result: any }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ result: any }>(API_ENDPOINTS.sessionItems.addResult, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async addSessionItemMedia(data: any): Promise<{ media: any }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ media: any }>(API_ENDPOINTS.sessionItems.addMedia, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async getSessionItemMedia(id: string, fileKey: string): Promise<{ media: any }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ media: any }>(API_ENDPOINTS.sessionItems.getMedia(id, fileKey), {
      method: 'GET',
      token: token || undefined,
    });
  },
};
