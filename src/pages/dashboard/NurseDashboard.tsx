import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Settings, FileText, AlertCircle, CheckCircle } from "lucide-react";

const NurseDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
          <p className="text-muted-foreground mt-1">Device monitoring and report management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Assigned Devices"
            value="5"
            icon={Settings}
            variant="primary"
          />
          <StatCard
            title="Reports Today"
            value="12"
            icon={FileText}
            variant="secondary"
          />
          <StatCard
            title="Active Alerts"
            value="2"
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Completed Tasks"
            value="18"
            icon={CheckCircle}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Device Status</h3>
            <div className="space-y-4">
              {[
                { device: "ECG Monitor #1234", status: "Online", battery: 85 },
                { device: "BP Monitor #5678", status: "Online", battery: 62 },
                { device: "Glucose Meter #9012", status: "Offline", battery: 15 },
                { device: "Pulse Oximeter #3456", status: "Online", battery: 95 },
              ].map((device, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{device.device}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      device.status === "Online" 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Battery:</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${device.battery > 50 ? "bg-success" : device.battery > 20 ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${device.battery}%` }} 
                      />
                    </div>
                    <span className="text-sm font-medium">{device.battery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-4">
              {[
                { patient: "John Doe", type: "ECG", time: "10 mins ago", urgent: false },
                { patient: "Jane Smith", type: "Blood Pressure", time: "25 mins ago", urgent: true },
                { patient: "Bob Johnson", type: "Glucose", time: "1 hour ago", urgent: false },
                { patient: "Alice Brown", type: "Pulse Oximetry", time: "2 hours ago", urgent: false },
              ].map((report, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{report.patient}</p>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{report.time}</p>
                    {report.urgent && (
                      <span className="text-xs text-destructive font-medium">Urgent</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
