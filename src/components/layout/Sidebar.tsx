import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Activity,
  Building2,
  UserCog,
  CreditCard,
  Video,
  Calendar,
  Shield,
  Stethoscope,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole") || "user";

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Dashboard", path: `/dashboard/${userRole}` },
    ];

    const roleSpecificItems: Record<string, any[]> = {
      "super-admin": [
        { icon: Shield, label: "Role Management", path: `/dashboard/${userRole}/roles` },
        { icon: Users, label: "User Management", path: `/dashboard/${userRole}/users` },
        { icon: FileText, label: "Audit Logs", path: `/dashboard/${userRole}/audit` },
      ],
      "executive-admin": [
        { icon: Building2, label: "Organizations", path: `/dashboard/${userRole}/organizations` },
        { icon: Stethoscope, label: "Doctors", path: `/dashboard/${userRole}/doctors` },
        { icon: UserCog, label: "Technicians", path: `/dashboard/${userRole}/technicians` },
        { icon: Settings, label: "Devices", path: `/dashboard/${userRole}/devices` },
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
      ],
      "cluster-head": [
        { icon: Building2, label: "Organizations", path: `/dashboard/${userRole}/organizations` },
        { icon: Users, label: "Team Management", path: `/dashboard/${userRole}/team` },
        { icon: CreditCard, label: "Payments", path: `/dashboard/${userRole}/payments` },
        { icon: Settings, label: "Devices", path: `/dashboard/${userRole}/devices` },
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
      ],
      "user-head": [
        { icon: Users, label: "Nurses", path: `/dashboard/${userRole}/nurses` },
        { icon: Building2, label: "Organization", path: `/dashboard/${userRole}/organization` },
        { icon: Settings, label: "Devices", path: `/dashboard/${userRole}/devices` },
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
      ],
      "nurse": [
        { icon: Settings, label: "Devices", path: `/dashboard/${userRole}/devices` },
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
        { icon: Building2, label: "Organization", path: `/dashboard/${userRole}/organization` },
      ],
      "user": [
        { icon: Users, label: "Profile", path: `/dashboard/${userRole}/profile` },
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
        { icon: Video, label: "Sessions", path: `/dashboard/${userRole}/sessions` },
        { icon: Stethoscope, label: "Consultancy", path: `/dashboard/${userRole}/consultancy` },
        { icon: CreditCard, label: "Payments", path: `/dashboard/${userRole}/payments` },
      ],
      "doctor": [
        { icon: FileText, label: "Reports", path: `/dashboard/${userRole}/reports` },
        { icon: Calendar, label: "Schedule", path: `/dashboard/${userRole}/schedule` },
        { icon: Video, label: "Consultations", path: `/dashboard/${userRole}/consultations` },
        { icon: Activity, label: "Prescriptions", path: `/dashboard/${userRole}/prescriptions` },
        { icon: CreditCard, label: "Payments", path: `/dashboard/${userRole}/payments` },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[userRole] || [])];
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Onyx Health+</h2>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {userRole.replace("-", " ")}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
