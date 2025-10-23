import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { FileText, Video, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your health overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Medical Reports"
            value="8"
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Upcoming Sessions"
            value="2"
            icon={Video}
            variant="secondary"
          />
          <StatCard
            title="Consultations"
            value="5"
            icon={Stethoscope}
            variant="default"
          />
          <StatCard
            title="Health Score"
            value="85%"
            icon={Activity}
            variant="success"
          />
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="gradient-primary h-auto py-6 flex flex-col gap-2">
              <Stethoscope className="h-6 w-6" />
              <span className="font-semibold">Book Consultation</span>
            </Button>
            <Button variant="secondary" className="h-auto py-6 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="font-semibold">View Reports</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Video className="h-6 w-6" />
              <span className="font-semibold">Join Session</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {[
                { title: "Blood Test Results", date: "Jan 15, 2025", status: "Normal" },
                { title: "ECG Report", date: "Jan 10, 2025", status: "Normal" },
                { title: "X-Ray Scan", date: "Jan 5, 2025", status: "Review Needed" },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === "Normal" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
            <div className="space-y-3">
              {[
                { doctor: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "Jan 20, 2025", time: "10:00 AM" },
                { doctor: "Dr. Michael Chen", specialty: "General Physician", date: "Jan 25, 2025", time: "2:30 PM" },
              ].map((appointment, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium">{appointment.doctor}</p>
                  <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-primary font-medium">{appointment.date}</span>
                    <span className="text-muted-foreground">{appointment.time}</span>
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

export default UserDashboard;
