import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";

import {
  Settings,
  Building2,
  FileText,
  HeartPulse,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

/* ------------------------------------------------------------------
  CLUSTER HEAD DASHBOARD — PREMIUM UI VERSION
------------------------------------------------------------------- */
const ClusterHeadDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [organizationInfo, setOrganizationInfo] = useState<{
    name?: string;
    code?: string;
    status?: string;
    location?: string;
  }>({});

  const [stats, setStats] = useState({
    devices: 0,
    userHeads: 0,
    nurses: 0,
    reports: 0,
  });

  const [deviceOverview, setDeviceOverview] = useState<
    { name: string; model: string; status: string; lastActive: string }[]
  >([]);

  const [recentReports, setRecentReports] = useState<
    {
      reportCode: string;
      patient: string;
      device: string;
      uploadedBy: string;
      createdAt: string;
    }[]
  >([]);

  const isMainDashboard = location.pathname === "/dashboard/cluster-head";

  /* ------------------------------------------------------------------
    Fetch Dashboard Data
------------------------------------------------------------------- */
  const fetchOrgOverview = async () => {
    setLoading(true);

    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");

      const data = await viewOrganization(orgId);
      const org = data.organization || data;

      const devices = org.devices || [];
      const userHeads = org.userHead || [];
      const nurses = org.nurse || [];
      const reports = org.reports || [];

      const loc = org.location
        ? `${org.location.line1 || ""}, ${org.location.line2 || ""}, ${
            org.location.line3 || ""
          }`
        : "N/A";

      setOrganizationInfo({
        name: org.organizationName || "Unnamed Organization",
        code: org.organizationCode || org.id,
        status: org.status || "Inactive",
        location: loc,
      });

      setStats({
        devices: devices.length,
        userHeads: userHeads.length,
        nurses: nurses.length,
        reports: reports.length,
      });

      setDeviceOverview(
        devices.map((d: any) => ({
          name: d.name || "Device",
          model: d.deviceCode || "—",
          status: "Active",
          lastActive: new Date(org.updatedAt || "").toLocaleString(),
        }))
      );

      setRecentReports(
        [...reports]
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
          .map((r: any) => ({
            reportCode: r.reportCode || "—",
            patient: r.profile?.name || "—",
            device: r.product?.deviceCode || "—",
            uploadedBy: r.uploadedBy?.name || "—",
            createdAt: new Date(r.createdAt).toLocaleString(),
          }))
      );
    } catch (err: any) {
      toast({
        title: "Failed to load dashboard",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgOverview();
  }, []);

  /* ------------------------------------------------------------------
    UI RENDER
------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-8 animate-fadeIn">
          {/* ===================== HEADER ===================== */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Cluster Head Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time insights into your organization.
            </p>
          </div>

          {/* ===================== ORGANIZATION CARD ===================== */}
          {!loading && (
            <div className="bg-card rounded-2xl shadow-lg border backdrop-blur-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all hover:shadow-xl">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {organizationInfo.name}
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Organization Code:</span>{" "}
                  {organizationInfo.code}
                </p>

                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {organizationInfo.location}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold ${
                    organizationInfo.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {organizationInfo.status}
                </span>
              </div>
            </div>
          )}

          {/* ===================== SUMMARY STATS ===================== */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Devices"
                value={stats.devices.toString()}
                icon={Settings}
                variant="primary"
              />
              <StatCard
                title="User Heads"
                value={stats.userHeads.toString()}
                icon={Building2}
                variant="secondary"
              />
              <StatCard
                title="Nurses"
                value={stats.nurses.toString()}
                icon={HeartPulse}
                variant="default"
              />
              <StatCard
                title="Reports"
                value={stats.reports.toString()}
                icon={FileText}
                variant="success"
              />
            </div>
          )}

          {/* ===================== DEVICE OVERVIEW ===================== */}
          <div className="bg-card border rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Device Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-3 px-4 text-left font-semibold">Device</th>
                    <th className="py-3 px-4 text-left font-semibold">Model</th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Last Active
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {deviceOverview.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No devices found
                      </td>
                    </tr>
                  ) : (
                    deviceOverview.map((dev, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{dev.name}</td>
                        <td className="py-3 px-4">{dev.model}</td>
                        <td className="py-3 px-4">{dev.lastActive}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================== RECENT REPORTS ===================== */}
          <div className="bg-card border rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-3 px-4 text-left font-semibold">
                      Report Code
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Patient
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">Device</th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Uploaded By
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No recent reports
                      </td>
                    </tr>
                  ) : (
                    recentReports.map((rep, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{rep.reportCode}</td>
                        <td className="py-3 px-4">{rep.patient}</td>
                        <td className="py-3 px-4">{rep.device}</td>
                        <td className="py-3 px-4">{rep.uploadedBy}</td>
                        <td className="py-3 px-4">{rep.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default ClusterHeadDashboard;
