import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Plus, Play } from "lucide-react";
import { useState } from "react";

const Sessions = () => {
  const [sessions] = useState([
    { id: 1, doctor: "Dr. Emily Rodriguez", type: "Follow-up", date: "2025-01-16", time: "10:00 AM", status: "Scheduled" },
    { id: 2, doctor: "Dr. James Wilson", type: "Consultation", date: "2025-01-15", time: "2:30 PM", status: "Completed" },
    { id: 3, doctor: "Dr. Sarah Kim", type: "Check-up", date: "2025-01-14", time: "11:00 AM", status: "Completed" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-muted-foreground mt-1">Manage your consultation sessions</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Doctor</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{session.doctor}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{session.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{session.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{session.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === "Scheduled" 
                            ? "bg-warning/10 text-warning" 
                            : "bg-success/10 text-success"
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {session.status === "Scheduled" && (
                          <Button size="sm" className="gradient-primary text-white">
                            <Play className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        )}
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

export default Sessions;
