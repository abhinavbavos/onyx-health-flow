import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Search, Edit, Activity } from "lucide-react";
import { useState } from "react";

const Devices = () => {
  const [devices] = useState([
    { id: 1, name: "ECG Monitor #A12", type: "Cardiac", location: "Ward A", status: "Online", lastSync: "2 mins ago" },
    { id: 2, name: "Blood Pressure Monitor #B34", type: "Vital Signs", location: "Ward B", status: "Online", lastSync: "5 mins ago" },
    { id: 3, name: "Glucose Monitor #C56", type: "Metabolic", location: "Lab C", status: "Offline", lastSync: "2 hours ago" },
    { id: 4, name: "Pulse Oximeter #D78", type: "Respiratory", location: "ICU", status: "Online", lastSync: "1 min ago" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Devices</h1>
            <p className="text-muted-foreground mt-1">Manage medical devices</p>
          </div>
          <Button className="gradient-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Devices</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search devices..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Device Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Last Sync</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{device.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{device.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{device.location}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Activity className={`h-3 w-3 ${device.status === "Online" ? "text-success" : "text-muted-foreground"}`} />
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            device.status === "Online" 
                              ? "bg-success/10 text-success" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {device.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{device.lastSync}</td>
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

export default Devices;
