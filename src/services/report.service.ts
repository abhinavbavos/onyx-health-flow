import { apiRequest } from "@/lib/api-request";

export const listReports = async () => {
  const res = await apiRequest("/api/report/all", { method: "GET" });
  return res.reports || [];
};

export const listReportsByProfile = async (id: string) => {
  const res = await apiRequest(`/api/report/byProfile/${id}`, { method: "GET" });
  return res.reports || [];
};
