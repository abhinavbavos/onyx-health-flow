import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Users, FileText, Settings, Activity } from "lucide-react";

const UserHeadDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Head Dashboard</h1>
          <p className="text-muted-foreground mt-1">Nurse and device management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Nurses"
            value="18"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Reports Today"
            value="45"
            icon={FileText}
            variant="secondary"
            trend={{ value: "8 from yesterday", isPositive: true }}
          />
          <StatCard
            title="Connected Devices"
            value="32"
            icon={Settings}
            variant="success"
          />
          <StatCard
            title="Alerts"
            value="3"
            icon={Activity}
            variant="warning"
          />
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Nurse Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nurse</th>
                  <th className="text-left py-3 px-4 font-semibold">Assigned Devices</th>
                  <th className="text-left py-3 px-4 font-semibold">Reports</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sarah Johnson", devices: 5, reports: 12, status: "Active" },
                  { name: "Michael Chen", devices: 4, reports: 9, status: "Active" },
                  { name: "Emma Williams", devices: 6, reports: 15, status: "Active" },
                  { name: "James Brown", devices: 3, reports: 7, status: "On Break" },
                ].map((nurse, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{nurse.name}</td>
                    <td className="py-3 px-4">{nurse.devices}</td>
                    <td className="py-3 px-4">{nurse.reports}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        nurse.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {nurse.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserHeadDashboard;
