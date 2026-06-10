import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Settings, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

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

  const fetchNurseDashboardData = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");

      const data = await viewOrganization(orgId);
      const org = data.organization || data;

      const devices = org.devices || [];
      const reports = org.reports || [];

      // Calculate dynamic stats
      const onlineDevices = devices.filter((d: any) => d.status === "Active" || d.online).length;
      const recentReportsList = [...reports]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
          time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.createdAt).toLocaleDateString(),
          urgent: r.urgent || false,
        }))
      );
    } catch (err: any) {
      toast({
        title: "Failed to load nurse dashboard",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurseDashboardData();
  }, []);

  return (
    <DashboardLayout>
      {isMainDashboard ? (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
            <p className="text-muted-foreground mt-1">Device monitoring and report management</p>
          </div>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Assigned Devices"
                value={stats.assignedDevices.toString()}
                icon={Settings}
                variant="primary"
              />
              <StatCard
                title="Reports Uploaded"
                value={stats.reportsToday.toString()}
                icon={FileText}
                variant="secondary"
              />
              <StatCard
                title="Active Alerts"
                value={stats.activeAlerts.toString()}
                icon={AlertCircle}
                variant="warning"
              />
              <StatCard
                title="Completed Tasks"
                value={stats.completedTasks.toString()}
                icon={CheckCircle}
                variant="success"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Status */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4">Device Status</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : devicesList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No devices found</p>
                ) : (
                  devicesList.map((device, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{device.device}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          device.status === "Online" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          {device.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Battery:</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${device.battery > 50 ? "bg-emerald-500" : device.battery > 20 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${device.battery}%` }} 
                          />
                        </div>
                        <span className="text-sm font-medium">{device.battery}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-card rounded-lg shadow-card p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : recentReports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No reports found</p>
                ) : (
                  recentReports.map((report, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{report.patient}</p>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{report.time}</p>
                        <p className="text-xs text-muted-foreground">{report.date}</p>
                        {report.urgent && (
                          <span className="text-xs text-rose-600 font-medium">Urgent</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
};

export default NurseDashboard;
