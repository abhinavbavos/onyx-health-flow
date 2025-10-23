import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Search, Edit } from "lucide-react";
import { useState } from "react";

const Nurses = () => {
  const [nurses] = useState([
    { id: 1, name: "Sarah Johnson", shift: "Morning", devices: 5, reports: 12, status: "Active" },
    { id: 2, name: "Michael Chen", shift: "Afternoon", devices: 4, reports: 9, status: "Active" },
    { id: 3, name: "Emma Williams", shift: "Night", devices: 6, reports: 15, status: "Active" },
    { id: 4, name: "James Brown", shift: "Morning", devices: 3, reports: 7, status: "On Break" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nurses</h1>
            <p className="text-muted-foreground mt-1">Manage nursing staff</p>
          </div>
          <Button className="gradient-primary text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Nurse
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Nurses</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search nurses..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Shift</th>
                    <th className="text-left py-3 px-4 font-semibold">Devices</th>
                    <th className="text-left py-3 px-4 font-semibold">Reports</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nurses.map((nurse) => (
                    <tr key={nurse.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{nurse.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{nurse.shift}</Badge>
                      </td>
                      <td className="py-3 px-4">{nurse.devices}</td>
                      <td className="py-3 px-4">{nurse.reports}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          nurse.status === "Active" 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        }`}>
                          {nurse.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
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

export default Nurses;
