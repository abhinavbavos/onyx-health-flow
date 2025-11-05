import { apiRequest } from "@/lib/api-request";

export const listDevices = () =>
  apiRequest("/api/view/devices");

export const createDevice = (data: any) =>
  apiRequest("/api/auth/create/device", {
    method: "POST",
    data,
  });

export const deleteDevice = (id: string) =>
  apiRequest(`/api/delete/device/${id}`, { method: "DELETE" });
