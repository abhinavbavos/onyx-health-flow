import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonStatGrid, SkeletonTable } from "@/components/dashboard/Skeletons";
import { Users, FileText, Settings, Loader2, HeartPulse, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";
import { listReportsByOrganization } from "@/services/report.service";

const UserHeadDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ nurses: 0, devices: 0, reports: 0 });
  const [nursesList, setNursesList] = useState<any[]>([]);

  const isMainDashboard = location.pathname === "/dashboard/user-head";
  const userName = localStorage.getItem("userName") || "";

  const fetchOrgData = async () => {
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
      const nurses = org.nurse || [];
      const reports = reportsData || [];

      setStats({ nurses: nurses.length, devices: devices.length, reports: reports.length });
      setNursesList(nurses);
    } catch (err: any) {
      toast({ title: "Failed to load dashboard data", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrgData(); }, []);

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader />

          <WelcomeBanner name={userName} role="user-head" />

          <QuickActions role="user-head" />

          {/* Stats */}
          {loading ? (
            <SkeletonStatGrid count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard title="Active Nurses" value={stats.nurses} icon={HeartPulse} variant="primary" />
              <StatCard title="Connected Devices" value={stats.devices} icon={Settings} variant="success" />
              <StatCard title="Total Reports" value={stats.reports} icon={FileText} variant="secondary" />
            </div>
          )}

          {/* Nurses Table */}
          <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-[#14213D]">Nurses Overview</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {nursesList.length} nurses
              </span>
            </div>

            {loading ? (
              <SkeletonTable rows={5} />
            ) : nursesList.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No nurses found"
                description="Nurses assigned to this organization will appear here."
              />
            ) : (
              <div className="space-y-3">
                {nursesList.map((nurse, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-white/80 transition-all cursor-pointer group"
                  >
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-sm uppercase shrink-0 shadow-sm">
                      {(nurse.name || "N")[0]}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#14213D] truncate">{nurse.name}</p>
                      {nurse.phone_number && (
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          +{nurse.phone_number.join(" ")}
                        </p>
                      )}
                    </div>
                    {/* Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        nurse.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-50 text-rose-500 border border-rose-100"
                      }`}
                    >
                      {nurse.status || "Unknown"}
                    </span>
                  </div>
                ))}
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

export default UserHeadDashboard;
