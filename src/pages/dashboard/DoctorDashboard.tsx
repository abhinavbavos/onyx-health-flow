import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, Video, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DoctorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your consultations and patients</p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="availability">Available for Consultations</Label>
            <Switch id="availability" defaultChecked />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Appointments"
            value="8"
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            title="Pending Consultations"
            value="3"
            icon={Video}
            variant="secondary"
          />
          <StatCard
            title="Reports to Review"
            value="12"
            icon={FileText}
            variant="warning"
          />
          <StatCard
            title="This Month Earnings"
            value="$12,450"
            icon={CreditCard}
            variant="success"
          />
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Today's Schedule</h3>
            <Button className="gradient-primary">
              <Video className="h-4 w-4 mr-2" />
              Quick Consult
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { patient: "John Doe", time: "09:00 AM", type: "Video Call", status: "Upcoming" },
              { patient: "Jane Smith", time: "10:30 AM", type: "Video Call", status: "In Progress" },
              { patient: "Bob Johnson", time: "11:45 AM", type: "Follow-up", status: "Upcoming" },
              { patient: "Alice Williams", time: "02:00 PM", type: "Video Call", status: "Upcoming" },
              { patient: "Charlie Brown", time: "03:30 PM", type: "Consultation", status: "Upcoming" },
            ].map((appointment, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                    {appointment.patient.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-primary">{appointment.time}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "In Progress" 
                      ? "bg-success/10 text-success" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.status === "In Progress" && (
                    <Button size="sm" className="gradient-primary">
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Prescriptions</h3>
            <div className="space-y-3">
              {[
                { patient: "John Doe", medication: "Amoxicillin 500mg", date: "Jan 15, 2025" },
                { patient: "Jane Smith", medication: "Lisinopril 10mg", date: "Jan 14, 2025" },
                { patient: "Bob Johnson", medication: "Metformin 850mg", date: "Jan 13, 2025" },
              ].map((prescription, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <p className="font-medium">{prescription.patient}</p>
                  <p className="text-sm text-muted-foreground">{prescription.medication}</p>
                  <p className="text-xs text-muted-foreground mt-1">{prescription.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Patient Reports</h3>
            <div className="space-y-3">
              {[
                { patient: "Alice Williams", report: "Blood Test Results", status: "Pending Review" },
                { patient: "Charlie Brown", report: "ECG Report", status: "Reviewed" },
                { patient: "David Lee", report: "X-Ray Scan", status: "Pending Review" },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium">{report.patient}</p>
                    <p className="text-sm text-muted-foreground">{report.report}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === "Reviewed" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
