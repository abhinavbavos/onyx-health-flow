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
    "executive-admin": [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/executive-admin",
      },
      {
        label: "Organizations",
        icon: Building2,
        path: "/dashboard/executive-admin/organizations",
      },
      {
        label: "Cluster Heads",
        icon: Users,
        path: "/dashboard/executive-admin/cluster-heads",
      },
      {
        label: "Executives",
        icon: Users,
        path: "/dashboard/executive-admin/executives",
      },
      {
        label: "Doctors",
        icon: Stethoscope,
        path: "/dashboard/executive-admin/doctors",
      },
      {
        label: "User Heads",
        icon: User2,
        path: "/dashboard/executive-admin/user-heads",
      },
      {
        label: "Nurses",
        icon: HeartPulse,
        path: "/dashboard/executive-admin/nurses",
      },
      {
        label: "Technicians",
        icon: Users,
        path: "/dashboard/executive-admin/technicians",
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
        "min-h-screen border-r bg-background flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* HEADER */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div
          className={cn(
            "flex items-center gap-3 transition-all",
            collapsed && "w-full justify-center"
          )}
        >
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-md">
            <Activity className="h-6 w-6 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg">Onyx Health+</h2>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole}
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={toggleCollapse}
            className="ml-auto text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isExpanded = expanded.includes(item.path);

          return (
            <div key={item.path}>
              {/* Parent Button */}
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all",
                  isActive(item.path)
                    ? "gradient-primary text-white shadow-md"
                    : "hover:bg-accent/10 hover:text-accent",
                  collapsed && "justify-center"
                )}
                onClick={() =>
                  item.children ? toggleExpand(item.path) : navigate(item.path)
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.children && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                )}
              </Button>

              {/* Submenu */}
              {item.children && (
                <div
                  className={cn(
                    "ml-4 overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-96" : "max-h-0"
                  )}
                >
                  {item.children.map((sub: any) => {
                    // ✅ Fix: Use exact match for all subroutes
                    const isSubActive = location.pathname === sub.path;

                    return (
                      <Button
                        key={sub.path}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm px-4 py-2 mt-1 rounded-md transition-all duration-200",
                          isSubActive
                            ? "bg-accent/20 text-accent font-medium border-l-2 border-accent"
                            : "hover:bg-accent/10 hover:text-accent hover:translate-x-1",
                          collapsed && "hidden"
                        )}
                        onClick={() => navigate(sub.path)}
                      >
                        {sub.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-destructive hover:bg-destructive/10",
            collapsed && "justify-center"
          )}
          onClick={() => {
            logout();
            toast({ title: "Signed out" });
            navigate("/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
