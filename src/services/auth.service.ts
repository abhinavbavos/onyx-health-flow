import { apiRequest, setAuthToken, clearAuthToken } from '@/lib/api-request';
import { API_ENDPOINTS } from '@/lib/api-config';
import { UserRole } from '@/types/roles';

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: any;
  message?: string;
}

export interface VerifyResponse extends AuthResponse {
  role?: UserRole;
}

// User Authentication
export const userAuth = async (email: string): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.USER_AUTH, {
    method: 'POST',
    data: { email },
    requiresAuth: false,
  });
};

export const userAuthVerify = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.USER_AUTH_VERIFY, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Super Admin
export const createSuperAdmin = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_SUPER_ADMIN, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifySuperAdmin = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_SUPER_ADMIN, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Executive Admin
export const createExecAdmin = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_EXEC_ADMIN, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyExecAdmin = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_EXEC_ADMIN, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Cluster Head
export const createClusterHead = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_CLUSTER_HEAD, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyClusterHead = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_CLUSTER_HEAD, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// User Head
export const createUserHead = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_USER_HEAD, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyUserHead = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_USER_HEAD, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Nurse
export const createNurse = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_NURSE, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyNurse = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_NURSE, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Technician
export const createTechnician = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.CREATE_TECHNICIAN, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyTechnician = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_TECHNICIAN, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Non-User
export const signinNonUser = async (data: any): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.SIGNIN_NON_USER, {
    method: 'POST',
    data,
    requiresAuth: false,
  });
};

export const verifyNonUser = async (email: string, otp: string): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_NON_USER, {
    method: 'POST',
    data: { email, otp },
    requiresAuth: false,
  });
  
  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }
  
  return response;
};

// Reissue Token
export const issueToken = async (): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.ISSUE_TOKEN, {
    method: 'GET',
    requiresAuth: true,
  });
};

// Logout
export const logout = (): void => {
  clearAuthToken();
};
