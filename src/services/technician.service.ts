import { apiRequest } from "@/lib/api-request";

export const listTechnicians = async () => {
  const res = await apiRequest("/api/view/AllTechnicians", { method: "GET" });
  return res.technicians || res.data || [];
};

export const createTechnician = async (payload: any) => {
  return apiRequest("/api/auth/create/technician", {
    method: "POST",
    data: payload,
  });
};

export const verifyTechnician = async (payload: any) => {
  return apiRequest("/api/auth/create/verify-technician", {
    method: "POST",
    data: payload,
  });
};

export const deleteTechnician = async (id: string) => {
  return apiRequest(`/api/delete/technician/${id}`, { method: "DELETE" });
}