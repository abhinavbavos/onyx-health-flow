import { apiRequest } from "@/lib/api-request";

export const listDoctors = async () => {
  const res = await apiRequest("/api/view/AllDoctors", { method: "GET" });
  return res.doctors || res.data || [];
};

export const createDoctor = async (payload: any) => {
  return apiRequest("/api/auth/create/doctor", {
    method: "POST",
    data: payload,
  });
};

export const deleteDoctor = async (id: string) => {
  return apiRequest(`/api/delete/doctor/${id}`, { method: "DELETE" });
};
    