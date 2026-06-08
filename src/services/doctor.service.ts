import { apiRequest } from "@/lib/api-request";

export const listDoctors = async () => {
  const res = await apiRequest("/api/doctor/list", { method: "GET" });
  return res.doctors || res.data || (Array.isArray(res) ? res : []);
};

export const createDoctor = async (payload: any) => {
  return apiRequest("/api/auth/create/doctor", {
    method: "POST",
    data: payload,
  });
};

export const deleteDoctor = async (id: string) => {
  return apiRequest(`/delete/profile/${id}`, { method: "DELETE" });
};

export const updateDoctor = async (id: string, payload: any) => {
  return apiRequest(`/update/user/${id}`, {
    method: "PUT",
    data: payload,
  });
};
    