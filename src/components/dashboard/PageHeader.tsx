import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  "super-admin": "Super Admin",
  "executive-admin": "Executive Admin",
  "cluster-head": "Cluster Head",
  "user-head": "User Head",
  nurse: "Nurse",
  technician: "Technician",
  doctor: "Doctor",
  analytics: "Analytics",
  organizations: "Organizations",
  "cluster-heads": "Cluster Heads",
  "user-heads": "User Heads",
  technicians: "Technicians",
  nurses: "Nurses",
  doctors: "Doctors",
  devices: "Devices",
  reports: "Reports",
  audit: "Audit Logs",
  roles: "Role Management",
  users: "Users",
  schedule: "Schedule",
  consultations: "Consultations",
  prescriptions: "Prescriptions",
  payments: "Payments",
  team: "Team Management",
  executives: "Executive Admins",
  "linked-accounts": "Linked Accounts",
  organization: "Organization",
  "machine-analytics": "Machine Analytics",
};

const PageHeader = ({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: labelMap[seg] || seg,
      path: "/" + arr.slice(0, i + 1).join("/"),
      isLast: i === arr.length - 1,
    }));

  return (
    <div className="mb-6 animate-fadeIn">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-3">
        <button
          onClick={() => navigate("/")}
          className="hover:text-[#F2052C] transition-colors flex items-center gap-1"
        >
          <Home className="h-3 w-3" />
          Home
        </button>
        {segments.map((seg) => (
          <span key={seg.path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <button
              onClick={() => !seg.isLast && navigate(seg.path)}
              className={
                seg.isLast
                  ? "text-[#F2052C] font-extrabold cursor-default"
                  : "hover:text-[#14213D] transition-colors cursor-pointer"
              }
            >
              {seg.label}
            </button>
          </span>
        ))}
      </nav>

      {/* Title + Subtitle */}
      {(title || subtitle) && (
        <div>
          {title && (
            <h1 className="text-3xl font-extrabold tracking-tight text-[#14213D] leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
