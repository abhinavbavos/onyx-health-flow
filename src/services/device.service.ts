import { apiRequest } from "@/lib/api-request";

export const listDevices = async () => {
  const res = await apiRequest("/api/view/devices");
  return res.devices || res.data || (Array.isArray(res) ? res : []);
};

export const createDevice = (data: any) =>
  apiRequest("/api/auth/create/device", {
    method: "POST",
    data,
  });

export const deleteDevice = (id: string) =>
  apiRequest(`/delete/profile/${id}`, { method: "DELETE" });
