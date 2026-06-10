import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  User2,
  FileText,
  Settings,
  Activity,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  LogOut,
  HeartPulse,
  Stethoscope,
  Building2,
  Calendar,
  Video,
  CreditCard,
  Shield,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

/* ============================================================
   FINAL UNIFIED SIDEBAR (all roles)
============================================================ */

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);

  /* Load correct role */
  useEffect(() => {
    const role = (localStorage.getItem("userRole") || "user").replace(
      /_/g,
      "-"
    );
    setUserRole(role);
  }, []);

  /* Role-based navigation */
  const NAV: Record<string, any[]> = {
    "super-admin": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/super-admin",
      },
      {
        label: "Roles",
        icon: ShieldCheck,
        path: "/dashboard/super-admin/roles",
      },
      {
        label: "Users",
        icon: Users,
        path: "/dashboard/super-admin/users",
      },
      {
        label: "Audit Logs",
        icon: FileText,
        path: "/dashboard/super-admin/audit",
      },
    ],
    "executive-admin": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/executive-admin",
      },
      {
        label: "Analytics",
        icon: Activity,
        path: "/dashboard/executive-admin/analytics",
      },
      {
        label: "Executive Admins",
        icon: Users,
        path: "/dashboard/executive-admin/executives",
      },
      {
        label: "Cluster Heads",
        icon: Users,
        path: "/dashboard/executive-admin/cluster-heads",
        children: [
          { label: "All Cluster Heads", path: "/dashboard/executive-admin/cluster-heads" },
          { label: "Organizations", path: "/dashboard/executive-admin/organizations" }
        ]
      },
      {
        label: "User Heads",
        icon: User2,
        path: "/dashboard/executive-admin/user-heads",
      },
      {
        label: "Technicians",
        icon: Settings,
        path: "/dashboard/executive-admin/technicians",
      },
      {
        label: "Nurses",
        icon: HeartPulse,
        path: "/dashboard/executive-admin/nurses",
      },
      {
        label: "Doctors",
        icon: Stethoscope,
        path: "/dashboard/executive-admin/doctors",
      },
      {
        label: "Devices",
        icon: Settings,
        path: "/dashboard/executive-admin/devices",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/executive-admin/reports",
      },
    ],

    "cluster-head": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/cluster-head",
      },
      {
        label: "Team Management",
        icon: Users,
        path: "/dashboard/cluster-head/team",
        children: [
          { label: "Overview", path: "/dashboard/cluster-head/team" },
          {
            label: "User Heads",
            path: "/dashboard/cluster-head/team/user-heads",
          },
          { label: "Nurses", path: "/dashboard/cluster-head/team/nurses" },
          {
            label: "Technicians",
            path: "/dashboard/cluster-head/team/technicians",
          },
        ],
      },
      {
        label: "Devices",
        icon: Settings,
        path: "/dashboard/cluster-head/devices",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/cluster-head/reports",
      },
      {
        label: "Consultations",
        icon: MessageSquare,
        path: "/dashboard/cluster-head/consultations",
      },
      {
        label: "Linked Accounts",
        icon: Building2,
        path: "/dashboard/cluster-head/linked-accounts",
      },
    ],

    "user-head": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/user-head",
      },
      {
        label: "Nurses",
        icon: HeartPulse,
        path: "/dashboard/user-head/nurses",
      },
      {
        label: "Devices",
        icon: Settings,
        path: "/dashboard/user-head/devices",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/user-head/reports",
      },
      {
        label: "Organization",
        icon: Building2,
        path: "/dashboard/user-head/organization",
      },
    ],

    "nurse": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/nurse",
      },
      {
        label: "Devices",
        icon: Settings,
        path: "/dashboard/nurse/devices",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/nurse/reports",
      },
      {
        label: "Organization",
        icon: Building2,
        path: "/dashboard/nurse/organization",
      },
    ],

    "technician": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/technician",
      },
      {
        label: "Devices",
        icon: Settings,
        path: "/dashboard/technician/devices",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/technician/reports",
      },
    ],

    "doctor": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/doctor",
      },
      {
        label: "Schedule",
        icon: Calendar,
        path: "/dashboard/doctor/schedule",
      },
      {
        label: "Consultations",
        icon: Video,
        path: "/dashboard/doctor/consultations",
      },
      {
        label: "Prescriptions",
        icon: FileText,
        path: "/dashboard/doctor/prescriptions",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/doctor/reports",
      },
      {
        label: "Payments",
        icon: CreditCard,
        path: "/dashboard/doctor/payments",
      },
    ],

    "user": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/user",
      },
      {
        label: "Profile",
        icon: User2,
        path: "/dashboard/user/profile",
      },
      {
        label: "Sessions",
        icon: Activity,
        path: "/dashboard/user/sessions",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/dashboard/user/reports",
      },
      {
        label: "Consultations",
        icon: Stethoscope,
        path: "/dashboard/user/consultancy",
      },
    ],
  };

  const items = NAV[userRole] || [];

  /* Active state check */
  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (path: string) => location.pathname.startsWith(path);

  /* Auto expand correct submenu */
  useEffect(() => {
    items.forEach((item) => {
      if (item.children) {
        const active = item.children.some((c: any) =>
          location.pathname.startsWith(c.path)
        );
        if (active && !expanded.includes(item.path)) {
          setExpanded((prev) => [...prev, item.path]);
        }
      }
    });
  }, [location.pathname]);

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  /* ============================================================
      UI RENDER
  ============================================================= */

  return (
    <aside
      className={cn(
        "glass-panel flex flex-col transition-all duration-300 rounded-[30px] my-2 ml-2 shadow-2xl relative border-none z-20 overflow-hidden",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* HEADER */}
      <div className={cn("h-20 flex items-center px-4 pt-4 relative", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3 transition-all">
          <button 
            onClick={toggleCollapse}
            className="h-12 w-12 rounded-[20px] bg-white flex items-center justify-center shadow-sm shrink-0 hover:scale-105 active:scale-95 transition-all"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {/* Custom Icon for Sidebar Header */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#2d3748]">
              <path fillRule="evenodd" d="M3 2.25a.75.75 0 000 1.5v16.5h16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-.75-.75H3zM4.5 3.75v15h15v-15h-15z" clipRule="evenodd" />
              <path d="M9.75 9a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
            </svg>
          </button>

          {!collapsed && (
            <div className="flex flex-col justify-center">
              <h2 className="font-extrabold text-lg text-[#2d3748] tracking-tight leading-tight">Onyx Health+</h2>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                {userRole.replace("-", " ")}
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={toggleCollapse}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 text-gray-400 hover:text-gray-800 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const isExpanded = expanded.includes(item.path);

          return (
            <div key={item.path}>
              {/* Parent Button */}
              <button
                className={cn(
                  "w-full flex items-center justify-between px-2 py-2 rounded-[20px] transition-all duration-200 border-none",
                  isActive(item.path) || isExpanded
                    ? "bg-white/70 shadow-sm text-[#2d3748]"
                    : "hover:bg-white/40 text-gray-500 hover:text-gray-800",
                  collapsed && "justify-center"
                )}
                onClick={() =>
                  item.children ? toggleExpand(item.path) : navigate(item.path)
                }
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-full flex items-center justify-center transition-colors",
                    isActive(item.path) || isExpanded ? "bg-white shadow-md text-[#2d3748]" : "text-gray-400"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  {!collapsed && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
                </div>

                {!collapsed && item.children && (
                  <div className="pr-2 text-gray-400">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.children && (
                <div
                  className={cn(
                    "ml-11 overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pl-2 border-l-2 border-gray-200/50 py-1 space-y-1">
                    {item.children.map((sub: any) => {
                      const isSubActive = location.pathname === sub.path;

                      return (
                        <button
                          key={sub.path}
                          className={cn(
                            "w-full flex justify-start text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 text-left",
                            isSubActive
                              ? "bg-white/60 text-[#2d3748] shadow-sm"
                              : "text-gray-500 hover:bg-white/30 hover:text-gray-800",
                            collapsed && "hidden"
                          )}
                          onClick={() => navigate(sub.path)}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto p-4 flex justify-center pb-6">
        {collapsed ? (
          <button
            className="h-12 w-12 bg-[#eb4e4e] rounded-[18px] flex items-center justify-center text-white shadow-lg hover:opacity-90 transition-opacity"
            onClick={() => {
              logout();
              toast({ title: "Signed out" });
              navigate("/login");
            }}
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : (
          <button
            className="w-full flex items-center justify-start bg-[#fce8e6] text-[#c5221f] hover:bg-[#fad2cf] rounded-[24px] p-2 pr-4 transition-colors"
            onClick={() => {
              logout();
              toast({ title: "Signed out" });
              navigate("/login");
            }}
          >
            <div className="h-10 w-10 bg-[#eb4e4e] rounded-[18px] flex items-center justify-center text-white mr-3 shadow-md shrink-0">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-wide">Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
