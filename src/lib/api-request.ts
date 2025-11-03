import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "./api-config";

interface ApiRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
};

export const apiRequest = async <T = any>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  const { requiresAuth = true, headers = {}, ...restConfig } = config;

  const requestConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    url: endpoint,
    method: restConfig.method || "GET",
    data: restConfig.data || {},
    params: restConfig.params || {},
    withCredentials: true, // ✅ allow cookies + CORS credentials
    timeout: 10000, // ✅ safety against indefinite hang
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // ✅ Add Authorization header if needed
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    console.log("🌐 [API] Request:", {
      url: `${API_BASE_URL}${endpoint}`,
      method: requestConfig.method,
      data: requestConfig.data,
      withCredentials: requestConfig.withCredentials,
    });

    const response: AxiosResponse<T> = await axios(requestConfig);

    console.log("✅ [API] Response:", response.status, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ [API] Error:", error.message);
      if (error.response) console.error("🧾 Response:", error.response.data);

      // Handle unauthorized
      if (error.response?.status === 401) {
        clearAuthToken();
        window.location.href = "/login";
      }
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};
