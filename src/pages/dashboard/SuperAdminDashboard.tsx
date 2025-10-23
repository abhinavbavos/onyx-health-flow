import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Shield, Users, FileText, Activity } from "lucide-react";

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System-wide overview and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Admins"
            value="24"
            icon={Shield}
            variant="primary"
            trend={{ value: "12% from last month", isPositive: true }}
          />
          <StatCard
            title="Total Users"
            value="1,284"
            icon={Users}
            variant="secondary"
            trend={{ value: "8% from last month", isPositive: true }}
          />
          <StatCard
            title="Audit Logs"
            value="45,678"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Admin role created</p>
                    <p className="text-sm text-muted-foreground">By super.admin@onyx.com</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2m ago</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">System Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm text-muted-foreground">99.9%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: "99.9%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Database Health</span>
                  <span className="text-sm text-muted-foreground">98.5%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: "98.5%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-muted-foreground">145ms</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
