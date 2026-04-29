import { apiRequest } from "@/lib/api-request";

export const listClusterHeads = async () => {
  return apiRequest("/api/view/AllClusters", {
    method: "GET",
  });
};

export const createClusterHead = async (payload: any) => {
  return apiRequest("/api/auth/create/cluster-head", {
    method: "POST",
    data: payload,
  });
};

export const verifyClusterHead = async (payload: any) => {
  return apiRequest("/api/auth/create/verify-cluster-head", {
    method: "POST",
    data: payload,
  });
};

export const deleteClusterHead = async (id: string) => {
  return apiRequest(`/delete/profile/${id}`, { method: "DELETE" });
};

export const updateClusterHead = async (id: string, payload: any) => {
  return apiRequest(`/update/profile/${id}`, {
    method: "PUT",
    data: payload,
  });
};
