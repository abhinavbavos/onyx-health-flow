import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AuditLogs = () => {
  const [logs] = useState([
    { id: 1, action: "User Created", user: "admin@onyxhealth.com", role: "Super Admin", timestamp: "2025-01-15 14:32", status: "Success" },
    { id: 2, action: "Role Updated", user: "exec@onyxhealth.com", role: "Executive Admin", timestamp: "2025-01-15 13:45", status: "Success" },
    { id: 3, action: "Login Attempt", user: "nurse@onyxhealth.com", role: "Nurse", timestamp: "2025-01-15 12:20", status: "Failed" },
    { id: 4, action: "Device Configured", user: "userhead@onyxhealth.com", role: "User Head", timestamp: "2025-01-15 11:15", status: "Success" },
    { id: 5, action: "Report Generated", user: "doctor@onyxhealth.com", role: "Doctor", timestamp: "2025-01-15 10:05", status: "Success" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activities</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity Log</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{log.action}</td>
                      <td className="py-3 px-4 text-muted-foreground">{log.user}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{log.role}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.status === "Success" 
                            ? "bg-success/10 text-success" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {log.status}
                        </span>
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

export default AuditLogs;
