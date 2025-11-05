import { apiRequest } from "@/lib/api-request";

export const listUserHeads = () => apiRequest("/api/view/AllUserHeads");

export const createUserHead = (data: any) =>
  apiRequest("/api/auth/create/user-head", {
    method: "POST",
    data,
  });

export const verifyUserHead = (data: { otp: string }) =>
  apiRequest("/api/auth/create/verify-user-head", {
    method: "POST",
    data,
  });

export const deleteUserHead = (id: string) =>
  apiRequest(`/api/delete/user-head/${id}`, { method: "DELETE" });
