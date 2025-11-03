import { apiRequest, setAuthToken, clearAuthToken } from "@/lib/api-request";
import { API_ENDPOINTS } from "@/lib/api-config";
import { UserRole } from "@/types/roles";

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

export interface VerifyResponse extends AuthResponse {
  role?: UserRole;
}

// ==================================================
// 🟢 PATIENT (USER) AUTH — OTP only
// ==================================================

// Step 1: Send OTP
export const userAuth = async (phone_number: string[]): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.USER_AUTH, {
    method: "POST",
    data: { phone_number },
    requiresAuth: false,
  });
};

// Step 2: Verify OTP
export const userAuthVerify = async ({
  phone_number,
  country,
  otp,
}: {
  phone_number: string[];
  country: string;
  otp: string;
}): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(
    API_ENDPOINTS.AUTH.USER_AUTH_VERIFY,
    {
      method: "POST",
      data: { phone_number, country, otp },
      requiresAuth: false,
    }
  );

  if (response.accessToken) setAuthToken(response.accessToken);
  return response;
};

// ==================================================
// 🟣 NON-USER (ADMIN, DOCTOR, ETC) AUTH — OTP + PASSWORD
// ==================================================

// Step 1: Send OTP (sets cookie __signInId)
export const signinNonUser = async (phone_number: string[]): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.SIGNIN_NON_USER, {
    method: "POST",
    data: { phone_number },
    requiresAuth: false,
  });
};

// Step 2: Verify OTP + Password
export const verifyNonUser = async ({
  otp,
  password,
}: {
  otp: string;
  password: string;
}): Promise<VerifyResponse> => {
  const response = await apiRequest<VerifyResponse>(
    API_ENDPOINTS.AUTH.VERIFY_NON_USER,
    {
      method: "POST",
      data: { otp, password },
      requiresAuth: false,
      withCredentials: true,
    }
  );

  if (response.accessToken) setAuthToken(response.accessToken);
  return response;
};

// ==================================================
// 🔁 TOKEN HANDLING
// ==================================================
export const issueToken = async (): Promise<AuthResponse> => {
  return apiRequest(API_ENDPOINTS.AUTH.ISSUE_TOKEN, {
    method: "GET",
    requiresAuth: true,
  });
};

// Logout
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userPhone");
  clearAuthToken();
};

// Optional: Refresh token (placeholder)
export const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await apiRequest<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    data: { refreshToken },
    requiresAuth: false,
  });

  if (response.accessToken) {
    localStorage.setItem("authToken", response.accessToken);
    setAuthToken(response.accessToken);
  }

  return response;
};
