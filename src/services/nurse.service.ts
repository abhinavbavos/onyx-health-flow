import { apiRequest } from "@/lib/api-request";

export const listNurses = async () => {
  const res = await apiRequest("/api/view/AllNurses", { method: "GET" });
  return res.nurses || res.data || [];
};

export const createNurse = async (payload: any) => {
  return apiRequest("/api/auth/create/nurse", {
    method: "POST",
    data: payload,
  });
};

export const deleteNurse = async (id: string) => {
  return apiRequest(`/api/delete/nurse/${id}`, { method: "DELETE" });
};
