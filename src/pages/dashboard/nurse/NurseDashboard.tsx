import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonStatGrid } from "@/components/dashboard/Skeletons";
import {
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Battery,
  Wifi,
  BatteryLow,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";
import { listReportsByOrganization } from "@/services/report.service";

const NurseDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedDevices: 0,
    reportsToday: 0,
    activeAlerts: 0,
    completedTasks: 0,
  });

  const [devicesList, setDevicesList] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const isMainDashboard = location.pathname === "/dashboard/nurse";
  const userName = localStorage.getItem("userName") || "";

  const fetchNurseDashboardData = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");

      const [orgData, reportsData] = await Promise.all([
        viewOrganization(orgId),
        listReportsByOrganization(orgId),
      ]);

      const org = orgData.organization || orgData;
      const devices = org.devices || [];
      const reports = reportsData || [];

      const onlineDevices = devices.filter((d: any) => d.status === "Active" || d.online).length;
      const recentReportsList = [...reports].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setStats({
        assignedDevices: devices.length,
        reportsToday: reports.length,
        activeAlerts: devices.length - onlineDevices,
        completedTasks: reports.length,
      });

      setDevicesList(
        devices.map((d: any, idx: number) => ({
          device: d.name || "Device",
          status: d.status === "Active" || d.online ? "Online" : "Offline",
          battery: [85, 62, 15, 95][idx % 4] || 75,
        }))
      );

      setRecentReports(
        recentReportsList.slice(0, 5).map((r: any) => ({
          patient: r.profile?.name || "Unknown Patient",
          type: r.product?.name || "General Diagnostics",
          time: new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: new Date(r.createdAt).toLocaleDateString(),
          urgent: r.urgent || false,
        }))
      );
    } catch (err: any) {
      toast({ title: "Failed to load nurse dashboard", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNurseDashboardData(); }, []);

  const getBatteryColor = (pct: number) =>
    pct > 50 ? "#10B981" : pct > 20 ? "#F59E0B" : "#F2052C";

  const getBatteryIcon = (pct: number) =>
    pct > 20 ? Battery : BatteryLow;

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader />

          <WelcomeBanner name={userName} role="nurse" />

          <QuickActions role="nurse" />

          {/* Stats */}
          {loading ? (
            <SkeletonStatGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Assigned Devices" value={stats.assignedDevices} icon={Settings} variant="primary" />
              <StatCard title="Reports Uploaded" value={stats.reportsToday} icon={FileText} variant="secondary" />
              <StatCard title="Active Alerts" value={stats.activeAlerts} icon={AlertCircle} variant="warning" />
              <StatCard title="Completed Tasks" value={stats.completedTasks} icon={CheckCircle} variant="success" />
            </div>
          )}

          {/* Devices & Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Device Status */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#14213D]">Device Status</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  <Wifi className="h-3 w-3" />
                  {devicesList.filter((d) => d.status === "Online").length} Online
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[#F2052C]" />
                </div>
              ) : devicesList.length === 0 ? (
                <EmptyState
                  icon={Settings}
                  title="No devices assigned"
                  description="Devices assigned to your organization will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {devicesList.map((device, i) => {
                    const BatteryIcon = getBatteryIcon(device.battery);
                    const batteryColor = getBatteryColor(device.battery);
                    return (
                      <div key={i} className="p-4 rounded-[16px] bg-slate-50/60 hover:bg-white/80 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-[12px] bg-[#35B7C9]/10 flex items-center justify-center">
                              <Settings className="h-4 w-4 text-[#35B7C9]" />
                            </div>
                            <p className="text-sm font-bold text-[#14213D]">{device.device}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              device.status === "Online"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-rose-50 text-rose-500 border border-rose-100"
                            }`}
                          >
                            {device.status}
                          </span>
                        </div>
                        {/* Battery Bar */}
                        <div className="flex items-center gap-3">
                          <BatteryIcon className="h-4 w-4 shrink-0" style={{ color: batteryColor }} />
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${device.battery}%`, background: batteryColor }}
                            />
                          </div>
                          <span className="text-xs font-extrabold" style={{ color: batteryColor }}>
                            {device.battery}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#14213D]">Recent Reports</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="h-3 w-3" /> Latest
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[#F2052C]" />
                </div>
              ) : recentReports.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No reports yet"
                  description="Reports uploaded via devices will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-white/80 transition-all cursor-pointer"
                    >
                      <div
                        className={`h-9 w-9 rounded-[12px] flex items-center justify-center shrink-0 ${
                          report.urgent
                            ? "bg-rose-50 text-rose-500"
                            : "bg-[#F2052C]/8 text-[#F2052C]"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#14213D] truncate">{report.patient}</p>
                          {report.urgent && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-100 text-rose-600 border border-rose-200 shrink-0">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{report.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-[#14213D]">{report.time}</p>
                        <p className="text-[10px] text-slate-400">{report.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

export default NurseDashboard;
