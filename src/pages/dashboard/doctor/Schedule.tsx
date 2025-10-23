import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock } from "lucide-react";
import { useState } from "react";

const Schedule = () => {
  const [appointments] = useState([
    { id: 1, patient: "John Smith", time: "09:00 AM", type: "Follow-up", duration: "30 min", status: "Confirmed" },
    { id: 2, patient: "Sarah Johnson", time: "10:00 AM", type: "Consultation", duration: "45 min", status: "Confirmed" },
    { id: 3, patient: "Michael Chen", time: "11:30 AM", type: "Check-up", duration: "30 min", status: "Pending" },
    { id: 4, patient: "Emma Davis", time: "02:00 PM", type: "Emergency", duration: "60 min", status: "Urgent" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground mt-1">Manage your consultation schedule</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule - January 15, 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{apt.patient}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{apt.type}</Badge>
                        <span className="text-sm text-muted-foreground">{apt.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{apt.time}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === "Confirmed" 
                          ? "bg-success/10 text-success" 
                          : apt.status === "Urgent"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <Button>Start Consultation</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
