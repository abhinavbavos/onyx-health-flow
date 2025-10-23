import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Plus, FileText } from "lucide-react";
import { useState } from "react";

const Prescriptions = () => {
  const [prescriptions] = useState([
    { id: 1, patient: "John Smith", medication: "Lisinopril 10mg", date: "2025-01-15", duration: "30 days" },
    { id: 2, patient: "Sarah Johnson", medication: "Metformin 500mg", date: "2025-01-14", duration: "90 days" },
    { id: 3, patient: "Michael Chen", medication: "Atorvastatin 20mg", date: "2025-01-13", duration: "60 days" },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">Create and manage prescriptions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold">Medication</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((rx) => (
                      <tr key={rx.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{rx.patient}</td>
                        <td className="py-3 px-4">{rx.medication}</td>
                        <td className="py-3 px-4 text-muted-foreground">{rx.date}</td>
                        <td className="py-3 px-4 text-muted-foreground">{rx.duration}</td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Prescription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient Name</Label>
                <Input id="patient" placeholder="Enter patient name" />
              </div>
              <div>
                <Label htmlFor="medication">Medication</Label>
                <Input id="medication" placeholder="Enter medication" />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g., 10mg" />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 30 days" />
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea id="instructions" placeholder="Enter instructions" rows={3} />
              </div>
              <Button className="w-full gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;
