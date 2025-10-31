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

// ==========================
// USER (PHONE-BASED AUTH)
// ==========================

// Step 1: Send OTP
export const userAuth = async (phone_number: string[]): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.USER_AUTH, {
    method: 'POST',
    data: { phone_number },
    requiresAuth: false,
  });
};

// Step 2: Verify OTP
export const userAuthVerify = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.USER_AUTH_VERIFY, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// SUPER ADMIN
// ==========================
export const verifySuperAdmin = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_SUPER_ADMIN, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// EXECUTIVE ADMIN
// ==========================
export const verifyExecAdmin = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_EXEC_ADMIN, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// CLUSTER HEAD
// ==========================
export const verifyClusterHead = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_CLUSTER_HEAD, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// USER HEAD
// ==========================
export const verifyUserHead = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_USER_HEAD, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// NURSE
// ==========================
export const verifyNurse = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_NURSE, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// TECHNICIAN
// ==========================
export const verifyTechnician = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_TECHNICIAN, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// DOCTOR / NON-USER
// ==========================
export const verifyNonUser = async (
  phone_number: string[],
  country: string,
  otp: string
): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(API_ENDPOINTS.AUTH.VERIFY_NON_USER, {
    method: 'POST',
    data: { phone_number, country, otp },
    requiresAuth: false,
  });

  if (response.token || response.accessToken) {
    setAuthToken(response.token || response.accessToken!);
  }

  return response;
};

// ==========================
// TOKEN / LOGOUT
// ==========================
export const issueToken = async (): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.ISSUE_TOKEN, {
    method: 'GET',
    requiresAuth: true,
  });
};

export const logout = (): void => {
  clearAuthToken();
};
