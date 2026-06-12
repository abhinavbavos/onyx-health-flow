import { useNavigate } from "react-router-dom";
import {
  type LucideIcon,
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
  UserPlus,
  HeartPulse,
  Stethoscope,
  Video,
  ShieldCheck,
  Wrench,
  ClipboardList,
  UserCog,
  CreditCard,
} from "lucide-react";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  path: string;
  color: string;
  bg: string;
}

const roleActions: Record<string, QuickAction[]> = {
  "super-admin": [
    { label: "Manage Roles", icon: ShieldCheck, path: "/dashboard/super-admin/roles", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "Manage Users", icon: Users, path: "/dashboard/super-admin/users", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Audit Logs", icon: FileText, path: "/dashboard/super-admin/audit", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  ],
  "executive-admin": [
    { label: "Add Cluster Head", icon: UserPlus, path: "/dashboard/executive-admin/cluster-heads", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "View Analytics", icon: BarChart3, path: "/dashboard/executive-admin/analytics", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Organizations", icon: Building2, path: "/dashboard/executive-admin/organizations", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { label: "Reports", icon: FileText, path: "/dashboard/executive-admin/reports", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
    { label: "Manage Doctors", icon: Stethoscope, path: "/dashboard/executive-admin/doctors", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
    { label: "Connected Devices", icon: Settings, path: "/dashboard/executive-admin/devices", color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
    { label: "User Heads", icon: UserCog, path: "/dashboard/executive-admin/user-heads", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
  ],
  "cluster-head": [
    { label: "Team", icon: Users, path: "/dashboard/cluster-head/team", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "Devices", icon: Settings, path: "/dashboard/cluster-head/devices", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Reports", icon: FileText, path: "/dashboard/cluster-head/reports", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { label: "Consultations", icon: Video, path: "/dashboard/cluster-head/consultations", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
    { label: "User Heads", icon: UserCog, path: "/dashboard/cluster-head/team/user-heads", color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
    { label: "Nurses", icon: HeartPulse, path: "/dashboard/cluster-head/team/nurses", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  ],
  "user-head": [
    { label: "Nurses", icon: HeartPulse, path: "/dashboard/user-head/nurses", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "Devices", icon: Settings, path: "/dashboard/user-head/devices", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Reports", icon: FileText, path: "/dashboard/user-head/reports", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { label: "Organization", icon: Building2, path: "/dashboard/user-head/organization", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
  ],
  nurse: [
    { label: "Upload Report", icon: ClipboardList, path: "/dashboard/nurse/reports", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "View Devices", icon: Settings, path: "/dashboard/nurse/devices", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Organization", icon: Building2, path: "/dashboard/nurse/organization", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
  ],
  technician: [
    { label: "Manage Devices", icon: Wrench, path: "/dashboard/technician/devices", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "View Reports", icon: FileText, path: "/dashboard/technician/reports", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
  ],
  doctor: [
    { label: "Today's Schedule", icon: ClipboardList, path: "/dashboard/doctor/schedule", color: "#F2052C", bg: "rgba(242,5,44,0.08)" },
    { label: "Consultations", icon: Video, path: "/dashboard/doctor/consultations", color: "#35B7C9", bg: "rgba(53,183,201,0.08)" },
    { label: "Prescriptions", icon: Stethoscope, path: "/dashboard/doctor/prescriptions", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { label: "View Reports", icon: FileText, path: "/dashboard/doctor/reports", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
    { label: "Billing & Payments", icon: CreditCard, path: "/dashboard/doctor/payments", color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
  ],
};

interface QuickActionsProps {
  role?: string;
}

const QuickActions = ({ role }: QuickActionsProps) => {
  const navigate = useNavigate();
  const actions = roleActions[role || ""] || [];

  if (actions.length === 0) return null;

  return (
    <div className="animate-fadeIn">
      <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] border border-white/60 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-sm group"
              style={{ boxShadow: `0 4px 16px ${action.bg}` }}
            >
              <div
                className="h-7 w-7 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: action.bg, color: action.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className="text-xs font-bold tracking-wide text-[#14213D] group-hover:text-[#14213D]"
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
