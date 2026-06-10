import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";

import {
  Settings,
  Cpu,
  FileText,
  ShieldCheck,
  MapPin,
  Loader2,
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

/* ------------------------------------------------------------------
  CLUSTER HEAD / TECHNICIAN DASHBOARD — PREMIUM UI VERSION
------------------------------------------------------------------- */
const TechnicianDashboard = () => {
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
    totalDevices: 0,
    activeDevices: 0,
    offlineDevices: 0,
    reportsCount: 0,
  });

  const [deviceOverview, setDeviceOverview] = useState<
    { name: string; model: string; status: string; lastActive: string }[]
  >([]);

  const isMainDashboard = location.pathname === "/dashboard/technician";

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

      const onlineCount = devices.filter((d: any) => d.status === "Active" || d.online).length;
      const offlineCount = devices.length - onlineCount;

      setStats({
        totalDevices: devices.length,
        activeDevices: onlineCount,
        offlineDevices: offlineCount,
        reportsCount: reports.length,
      });

      setDeviceOverview(
        devices.map((d: any) => ({
          name: d.name || "Device",
          model: d.deviceCode || "—",
          status: d.status || "Active",
          lastActive: new Date(org.updatedAt || "").toLocaleString(),
        }))
      );
    } catch (err: any) {
      toast({
        title: "Failed to load technician dashboard",
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

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-8 animate-fadeIn">
          {/* ===================== HEADER ===================== */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Technician Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Medical device diagnostics and monitoring dashboard.
            </p>
          </div>

          {/* ===================== ORGANIZATION INFO ===================== */}
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
                title="Total Devices"
                value={stats.totalDevices.toString()}
                icon={Settings}
                variant="primary"
              />
              <StatCard
                title="Active Devices"
                value={stats.activeDevices.toString()}
                icon={Cpu}
                variant="success"
              />
              <StatCard
                title="Offline/Inactive"
                value={stats.offlineDevices.toString()}
                icon={Settings}
                variant="warning"
              />
              <StatCard
                title="System Reports"
                value={stats.reportsCount.toString()}
                icon={FileText}
                variant="default"
              />
            </div>
          )}

          {/* ===================== DEVICE SUMMARY TABLE ===================== */}
          <div className="bg-card border rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Registered Devices</h3>
              <button
                onClick={() => navigate("/dashboard/technician/devices")}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Manage Devices →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-3 px-4 text-left font-semibold">Device</th>
                    <th className="py-3 px-4 text-left font-semibold">Model</th>
                    <th className="py-3 px-4 text-left font-semibold">Last Synced</th>
                    <th className="py-3 px-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          Loading devices...
                        </div>
                      </td>
                    </tr>
                  ) : deviceOverview.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-muted-foreground">
                        No devices found
                      </td>
                    </tr>
                  ) : (
                    deviceOverview.slice(0, 5).map((dev, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{dev.name}</td>
                        <td className="py-3 px-4">{dev.model}</td>
                        <td className="py-3 px-4">{dev.lastActive}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              dev.status === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {dev.status}
                          </span>
                        </td>
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

export default TechnicianDashboard;
