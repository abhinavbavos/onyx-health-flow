import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonStatGrid } from "@/components/dashboard/Skeletons";
import {
  Settings,
  Cpu,
  FileText,
  ShieldCheck,
  MapPin,
  Wrench,
  Wifi,
  WifiOff,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

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
  const userName = localStorage.getItem("userName") || "";

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
        ? `${org.location.line1 || ""}, ${org.location.line2 || ""}, ${org.location.line3 || ""}`
        : "N/A";

      setOrganizationInfo({
        name: org.organizationName || "Unnamed Organization",
        code: org.organizationCode || org.id,
        status: org.status || "Inactive",
        location: loc,
      });

      const onlineCount = devices.filter((d: any) => d.status === "Active" || d.online).length;
      setStats({
        totalDevices: devices.length,
        activeDevices: onlineCount,
        offlineDevices: devices.length - onlineCount,
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader />

          <WelcomeBanner name={userName} role="technician" />

          <QuickActions role="technician" />

          {/* Organization Banner */}
          {!loading && organizationInfo.name && (
            <div
              className="rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover-lift"
              style={{
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-[18px] bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
                  <Wrench className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#14213D] leading-tight">
                    {organizationInfo.name}
                  </h2>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-0.5">
                    Code: {organizationInfo.code}
                  </p>
                  {organizationInfo.location && organizationInfo.location !== "N/A" && (
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {organizationInfo.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    organizationInfo.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-rose-100 text-rose-600 border border-rose-200"
                  }`}
                >
                  {organizationInfo.status}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          {loading ? (
            <SkeletonStatGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Devices" value={stats.totalDevices} icon={Settings} variant="primary" />
              <StatCard title="Active Devices" value={stats.activeDevices} icon={Cpu} variant="success" />
              <StatCard title="Offline / Inactive" value={stats.offlineDevices} icon={Settings} variant="warning" />
              <StatCard title="System Reports" value={stats.reportsCount} icon={FileText} variant="default" />
            </div>
          )}

          {/* Device Cards */}
          <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-[#14213D]">Registered Devices</h3>
              <button
                onClick={() => navigate("/dashboard/technician/devices")}
                className="flex items-center gap-1 text-xs font-extrabold text-[#F2052C] hover:opacity-70 transition-opacity"
              >
                Manage <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-slate-400 text-center py-10">Loading devices...</div>
            ) : deviceOverview.length === 0 ? (
              <EmptyState
                icon={Settings}
                title="No devices registered"
                description="Devices assigned to your organization will appear here."
              />
            ) : (
              <div className="space-y-3">
                {deviceOverview.slice(0, 6).map((dev, i) => {
                  const isOnline = dev.status === "Active";
                  const NetIcon = isOnline ? Wifi : WifiOff;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-white/80 transition-all"
                    >
                      <div
                        className={`h-10 w-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                          isOnline ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        <NetIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#14213D] truncate">{dev.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{dev.model}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          isOnline
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}
                      >
                        {dev.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <Outlet />
        </div>
      )}
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
