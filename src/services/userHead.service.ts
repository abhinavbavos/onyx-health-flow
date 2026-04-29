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
  apiRequest(`/delete/profile/${id}`, { method: "DELETE" });

export const updateUserHead = (id: string, data: any) =>
  apiRequest(`/update/profile/${id}`, {
    method: "PUT",
    data,
  });
