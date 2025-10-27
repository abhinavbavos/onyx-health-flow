import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { UserRole } from '@/types/roles';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface OtpResponse {
  message: string;
}

interface SignupData {
  phone_number: [string, string];
  password?: string;
  name?: string;
  country: string;
  orgId?: string;
  permissions?: string;
  devices?: string;
  creatorRole?: string;
}

interface VerifyData {
  phone_number: [string, string];
  country: string;
  otp: string;
}

export const authService = {
  // Regular user signup - Step 1: Request OTP
  async requestOtp(phoneNumber: [string, string]): Promise<OtpResponse> {
    return apiRequest<OtpResponse>(API_ENDPOINTS.auth.signup, {
      method: 'POST',
      body: { phone_number: phoneNumber },
    });
  },

  // Regular user signup - Step 2: Verify OTP
  async verifyOtp(data: VerifyData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.verify, {
      method: 'POST',
      body: data,
    });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  // Role-based signup (Super Admin, Exec Admin, etc.)
  async roleSignupStep1(role: UserRole, data: SignupData): Promise<OtpResponse> {
    const endpoints: Record<string, string> = {
      'super-admin': API_ENDPOINTS.auth.createSuperAdmin,
      'executive-admin': API_ENDPOINTS.auth.createExecAdmin,
      'cluster-head': API_ENDPOINTS.auth.createClusterHead,
      'user-head': API_ENDPOINTS.auth.createUserHead,
      'nurse': API_ENDPOINTS.auth.createNurse,
      'doctor': API_ENDPOINTS.auth.createTechnician, // Assuming doctor uses technician endpoint
    };

    const endpoint = endpoints[role];
    if (!endpoint) {
      throw new Error(`Unsupported role: ${role}`);
    }

    return apiRequest<OtpResponse>(endpoint, {
      method: 'POST',
      body: data,
    });
  },

  async roleSignupStep2(role: UserRole, otp: string, creatorRole?: string): Promise<AuthResponse> {
    const endpoints: Record<string, string> = {
      'super-admin': API_ENDPOINTS.auth.verifySuperAdmin,
      'executive-admin': API_ENDPOINTS.auth.verifyExecAdmin,
      'cluster-head': API_ENDPOINTS.auth.verifyClusterHead,
      'user-head': API_ENDPOINTS.auth.verifyUserHead,
      'nurse': API_ENDPOINTS.auth.verifyNurse,
      'doctor': API_ENDPOINTS.auth.verifyTechnician,
    };

    const endpoint = endpoints[role];
    if (!endpoint) {
      throw new Error(`Unsupported role: ${role}`);
    }

    const body: any = { otp };
    if (creatorRole && role === 'executive-admin') {
      body.creatorRole = creatorRole;
    }

    const response = await apiRequest<AuthResponse>(endpoint, {
      method: 'POST',
      body,
    });
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  // Reissue access token
  async refreshAccessToken(): Promise<AuthResponse> {
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error('No tokens available');
    }

    const response = await apiRequest<AuthResponse>(API_ENDPOINTS.auth.issueToken, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Refresh-Token': `Bearer ${refreshToken}`,
      },
    });
    
    tokenManager.setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  // Logout
  logout() {
    tokenManager.clearTokens();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },
};
