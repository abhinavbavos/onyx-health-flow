import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonStatGrid, SkeletonTable } from "@/components/dashboard/Skeletons";
import {
  Settings,
  Building2,
  FileText,
  HeartPulse,
  ShieldCheck,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";
import { listReportsByOrganization } from "@/services/report.service";

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

      const [orgData, reportsData] = await Promise.all([
        viewOrganization(orgId),
        listReportsByOrganization(orgId),
      ]);

      const org = orgData.organization || orgData;

      const devices = org.devices || [];
      const userHeads = org.userHead || [];
      const nurses = org.nurse || [];
      const reports = reportsData || [];

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
            createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
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

  const userName = localStorage.getItem("userName") || "";

  /* ------------------------------------------------------------------
    UI RENDER
  ------------------------------------------------------------------- */
  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader />

          {/* Welcome Banner */}
          <WelcomeBanner name={userName} role="cluster-head" />

          {/* Quick Actions */}
          <QuickActions role="cluster-head" />

          {/* Organization Info Banner */}
          {!loading && organizationInfo.name && (
            <div
              className="rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover-lift cursor-default"
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "1px solid rgba(53,183,201,0.2)",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-[18px] bg-gradient-to-br from-[#35B7C9] to-[#48D5E7] flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
                  {organizationInfo.name?.[0] || "O"}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#14213D] leading-tight">{organizationInfo.name}</h2>
                  <p className="text-xs font-bold text-[#35B7C9] uppercase tracking-wider mt-0.5">
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
              <StatCard title="Devices" value={stats.devices} icon={Settings} variant="primary" />
              <StatCard title="User Heads" value={stats.userHeads} icon={Users} variant="secondary" />
              <StatCard title="Nurses" value={stats.nurses} icon={HeartPulse} variant="default" />
              <StatCard title="Reports" value={stats.reports} icon={FileText} variant="success" />
            </div>
          )}

          {/* Team Ratio Pills */}
          {!loading && (
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Team Composition</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#35B7C9]/8 border border-[#35B7C9]/15">
                  <Users className="h-4 w-4 text-[#35B7C9]" />
                  <span className="text-sm font-extrabold text-[#35B7C9]">{stats.userHeads}</span>
                  <span className="text-xs font-bold text-slate-500">User Heads</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2052C]/8 border border-[#F2052C]/15">
                  <HeartPulse className="h-4 w-4 text-[#F2052C]" />
                  <span className="text-sm font-extrabold text-[#F2052C]">{stats.nurses}</span>
                  <span className="text-xs font-bold text-slate-500">Nurses</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                  <Settings className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-extrabold text-emerald-600">{stats.devices}</span>
                  <span className="text-xs font-bold text-slate-500">Devices</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-extrabold text-amber-600">{stats.reports}</span>
                  <span className="text-xs font-bold text-slate-500">Reports</span>
                </div>
              </div>
            </div>
          )}

          {/* Device & Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Device Overview */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#14213D]">Device Overview</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{stats.devices} total</span>
              </div>
              {loading ? (
                <SkeletonTable rows={4} />
              ) : deviceOverview.length === 0 ? (
                <EmptyState icon={Settings} title="No devices registered" description="Devices registered to this organization will appear here." />
              ) : (
                <div className="space-y-3">
                  {deviceOverview.map((dev, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-slate-50 transition-colors">
                      <div className="h-9 w-9 rounded-[12px] bg-[#35B7C9]/10 flex items-center justify-center shrink-0">
                        <Settings className="h-4 w-4 text-[#35B7C9]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#14213D] truncate">{dev.name}</p>
                        <p className="text-xs text-slate-400 font-semibold">{dev.model}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reports */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#14213D]">Recent Reports</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="h-3 w-3" /> Latest 5
                </div>
              </div>
              {loading ? (
                <SkeletonTable rows={5} />
              ) : recentReports.length === 0 ? (
                <EmptyState icon={FileText} title="No reports yet" description="Reports generated from devices will appear here." />
              ) : (
                <div className="space-y-3">
                  {recentReports.map((rep, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="h-9 w-9 rounded-[12px] bg-[#F2052C]/8 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-[#F2052C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-[#F2052C] uppercase tracking-wider">{rep.reportCode}</p>
                        <p className="text-sm font-bold text-[#14213D] truncate">{rep.patient}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">{rep.uploadedBy} · {rep.createdAt}</p>
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

export default ClusterHeadDashboard;
