import { apiRequest } from "@/lib/api-request";

/* ================================
   Executive Admin Service
================================ */
export const listExecutives = async () => {
  return apiRequest("/api/view/AllExecutives", { method: "GET" });
};

export const createExecAdmin = async (payload: any) => {
  return apiRequest("/api/auth/create/exec-admin", {
    method: "POST",
    data: payload,
  });
};

export const verifyExecAdmin = async (payload: any) => {
  return apiRequest("/api/auth/create/verify-exec-admin", {
    method: "POST",
    data: payload,
  });
};
