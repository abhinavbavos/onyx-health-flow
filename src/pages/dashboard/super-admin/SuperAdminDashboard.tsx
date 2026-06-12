import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/dashboard/PageHeader";
import { Shield, Users, FileText, Activity, Clock, CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ACTIVITY_LOG = [
  { icon: CheckCircle2, color: "#10B981", bg: "rgba(16,185,129,0.08)", title: "Admin role created", desc: "By super.admin@onyx.com", time: "2m ago" },
  { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245,158,11,0.08)", title: "Permission updated", desc: "cluster_head role modified", time: "18m ago" },
  { icon: Info, color: "#35B7C9", bg: "rgba(53,183,201,0.08)", title: "New executive admin", desc: "Rohan Mehta onboarded", time: "1h ago" },
  { icon: Shield, color: "#F2052C", bg: "rgba(242,5,44,0.08)", title: "Security audit", desc: "Monthly audit completed", time: "3h ago" },
];

const SYSTEM_METRICS = [
  { label: "Server Uptime", value: 99.9, color: "#10B981" },
  { label: "Database Health", value: 98.5, color: "#35B7C9" },
  { label: "API Response (145ms)", value: 75, color: "#F2052C" },
  { label: "Storage Used", value: 63, color: "#F59E0B" },
];

const SuperAdminDashboard = () => {
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard/super-admin";
  const userName = localStorage.getItem("userName") || "";

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <PageHeader />

          <WelcomeBanner name={userName} role="super-admin" />

          <QuickActions role="super-admin" />

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Admins"
              value={24}
              icon={Shield}
              variant="primary"
              trend={{ value: "12% from last month", isPositive: true }}
            />
            <StatCard
              title="Total Users"
              value={1284}
              icon={Users}
              variant="secondary"
              trend={{ value: "8% from last month", isPositive: true }}
            />
            <StatCard
              title="Audit Logs"
              value={45678}
              icon={FileText}
              variant="default"
            />
            <StatCard
              title="System Health"
              value="98.5%"
              icon={Activity}
              variant="success"
            />
          </div>

          {/* Activity + Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Activity Feed */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#14213D]">Recent Activities</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Live
                </span>
              </div>
              <div className="space-y-3">
                {ACTIVITY_LOG.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-[16px] hover:bg-slate-50/60 transition-colors"
                    >
                      <div
                        className="h-10 w-10 rounded-[14px] flex items-center justify-center shrink-0"
                        style={{ background: item.bg, color: item.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#14213D] truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 font-semibold truncate">{item.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 shrink-0 uppercase tracking-wider">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
              <h3 className="text-base font-extrabold text-[#14213D] mb-5">System Metrics</h3>
              <div className="space-y-5">
                {SYSTEM_METRICS.map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-[#14213D]">{metric.label}</span>
                      <span className="text-sm font-extrabold" style={{ color: metric.color }}>
                        {metric.value}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${metric.value}%`, background: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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

export default SuperAdminDashboard;
