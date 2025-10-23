import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

const Consultations = () => {
  const [consultations] = useState([
    { id: 1, patient: "John Smith", date: "2025-01-15", time: "09:00 AM", status: "In Progress", notes: "Regular check-up" },
    { id: 2, patient: "Sarah Johnson", date: "2025-01-15", time: "10:00 AM", status: "Scheduled", notes: "Follow-up on medication" },
    { id: 3, patient: "Michael Chen", date: "2025-01-14", time: "02:30 PM", status: "Completed", notes: "Initial consultation" },
    { id: 4, patient: "Emma Davis", date: "2025-01-14", time: "11:00 AM", status: "Completed", notes: "Post-surgery check" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Consultations</h1>
          <p className="text-muted-foreground mt-1">Manage video consultations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Consultation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Notes</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((consult) => (
                    <tr key={consult.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{consult.patient}</td>
                      <td className="py-3 px-4 text-muted-foreground">{consult.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{consult.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consult.status === "In Progress" 
                            ? "bg-warning/10 text-warning" 
                            : consult.status === "Scheduled"
                            ? "bg-primary/10 text-primary"
                            : "bg-success/10 text-success"
                        }`}>
                          {consult.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{consult.notes}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {consult.status !== "Completed" && (
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Consultations;
