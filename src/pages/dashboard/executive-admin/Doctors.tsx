import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, UserPlus, Search, Edit, Phone } from "lucide-react";
import { useState } from "react";

const Doctors = () => {
  const [doctors] = useState([
    { id: 1, name: "Dr. Emily Rodriguez", specialty: "Cardiology", patients: 45, availability: "Available", phone: "+1 555-0123" },
    { id: 2, name: "Dr. James Wilson", specialty: "Neurology", patients: 38, availability: "Busy", phone: "+1 555-0124" },
    { id: 3, name: "Dr. Sarah Kim", specialty: "Pediatrics", patients: 52, availability: "Available", phone: "+1 555-0125" },
    { id: 4, name: "Dr. Michael Chen", specialty: "Orthopedics", patients: 41, availability: "Off Duty", phone: "+1 555-0126" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctors</h1>
            <p className="text-muted-foreground mt-1">Manage medical professionals</p>
          </div>
          <Button className="gradient-primary text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Doctors</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search doctors..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                    <th className="text-left py-3 px-4 font-semibold">Patients</th>
                    <th className="text-left py-3 px-4 font-semibold">Availability</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{doctor.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </td>
                      <td className="py-3 px-4">{doctor.patients}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doctor.availability === "Available" 
                            ? "bg-success/10 text-success" 
                            : doctor.availability === "Busy"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {doctor.availability}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{doctor.phone}</td>
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

export default Doctors;
