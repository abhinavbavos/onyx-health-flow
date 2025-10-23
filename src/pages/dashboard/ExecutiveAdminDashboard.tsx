import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Building2, Stethoscope, UserCog, Settings } from "lucide-react";

const ExecutiveAdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Executive Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Organization and resource management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Organizations"
            value="42"
            icon={Building2}
            variant="primary"
            trend={{ value: "5 new this month", isPositive: true }}
          />
          <StatCard
            title="Active Doctors"
            value="156"
            icon={Stethoscope}
            variant="secondary"
            trend={{ value: "12 from last month", isPositive: true }}
          />
          <StatCard
            title="Technicians"
            value="89"
            icon={UserCog}
            variant="default"
          />
          <StatCard
            title="Connected Devices"
            value="328"
            icon={Settings}
            variant="success"
          />
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Organization Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold">Doctors</th>
                  <th className="text-left py-3 px-4 font-semibold">Devices</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "City Hospital", doctors: 45, devices: 120, status: "Active" },
                  { name: "Care Medical Center", doctors: 32, devices: 85, status: "Active" },
                  { name: "Health Plus Clinic", doctors: 28, devices: 67, status: "Active" },
                  { name: "Metro Healthcare", doctors: 51, devices: 56, status: "Pending" },
                ].map((org, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{org.name}</td>
                    <td className="py-3 px-4">{org.doctors}</td>
                    <td className="py-3 px-4">{org.devices}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        org.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : "bg-warning/10 text-warning"
                      }`}>
                        {org.status}
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

export default ExecutiveAdminDashboard;
