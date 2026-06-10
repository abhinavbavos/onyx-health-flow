import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Users, FileText, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

const UserHeadDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    nurses: 0,
    devices: 0,
    reports: 0,
  });
  
  const [nursesList, setNursesList] = useState<any[]>([]);
  
  const isMainDashboard = location.pathname === "/dashboard/user-head";

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");

      const data = await viewOrganization(orgId);
      const org = data.organization || data;

      const devices = org.devices || [];
      const nurses = org.nurse || [];
      const reports = org.reports || [];

      setStats({
        nurses: nurses.length,
        devices: devices.length,
        reports: reports.length,
      });

      setNursesList(nurses);
    } catch (err: any) {
      toast({
        title: "Failed to load dashboard data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">User Head Dashboard</h1>
            <p className="text-muted-foreground mt-1">Nurse and device management</p>
          </div>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Active Nurses"
                value={stats.nurses.toString()}
                icon={Users}
                variant="primary"
              />
              <StatCard
                title="Connected Devices"
                value={stats.devices.toString()}
                icon={Settings}
                variant="success"
              />
              <StatCard
                title="Total Reports"
                value={stats.reports.toString()}
                icon={FileText}
                variant="secondary"
              />
            </div>
          )}

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Nurses Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Nurse</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone Number</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-muted-foreground">
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          Loading nurses...
                        </div>
                      </td>
                    </tr>
                  ) : nursesList.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-muted-foreground">
                        No nurses found
                      </td>
                    </tr>
                  ) : (
                    nursesList.map((nurse, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{nurse.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {nurse.phone_number ? `+${nurse.phone_number.join(" ")}` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            nurse.status === "Active" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-rose-100 text-rose-700"
                          }`}>
                            {nurse.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default UserHeadDashboard;
