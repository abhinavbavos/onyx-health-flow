import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Edit, Trash2, Stethoscope, Phone } from "lucide-react";
import { createDoctor, deleteDoctor, listDoctors } from "@/services/doctor.service";
import { listOrganizations } from "@/services/organization.service";

interface Doctor {
  id: string;
    _id?: string;
  name: string;
  phone_number: string[];
  country: string;
  specialty?: string;
  organizationName?: string;
  orgId?: string;
  status: string;
}

interface Organization {
  id: string;
  organizationName: string;
}

const EA_Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    specialty: "",
    country: "India",
    orgId: "",
  });

  // ================================
  // Fetch All Doctors
  // ================================
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await listDoctors();
      setDoctors(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load doctors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Fetch Organizations
  // ================================
  const fetchOrganizations = async () => {
    try {
      const data = await listOrganizations();
      const orgList = data.organizations || data;
      setOrganizations(orgList);
    } catch (err) {
      console.error(err);
      toast({ title: "Error fetching organizations", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchOrganizations();
  }, []);

  // ================================
  // Search Filter
  // ================================
  useEffect(() => {
    if (search.trim() === "") setFiltered(doctors);
    else {
      setFiltered(
        doctors.filter((d) =>
          d.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, doctors]);

  // ================================
  // Create Doctor
  // ================================
  const handleSubmit = async () => {
    const { name, phone_country, phone_number, password, specialty, orgId } = formData;

    if (!name || !phone_number || !password || !specialty || !orgId) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        phone_number: [phone_country, phone_number],
        password,
        name,
        country: formData.country,
        specialty,
        orgId,
        permissions: ["view-patients", "view-sessions"],
      };

      await createDoctor(payload);
      toast({ title: "Doctor created successfully" });
      setDialogOpen(false);
      setFormData({
        name: "",
        phone_country: "91",
        phone_number: "",
        password: "",
        specialty: "",
        country: "India",
        orgId: "",
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating doctor", variant: "destructive" });
    }
  };

  // ================================
  // Delete Doctor
  // ================================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      toast({ title: "Doctor deleted" });
      fetchDoctors();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-primary" /> Doctors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage doctors assigned to specific organizations
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Doctor</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Country Code"
                  value={formData.phone_country}
                  onChange={(e) => setFormData({ ...formData, phone_country: e.target.value })}
                  className="w-20"
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
              <Input
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Select
                onValueChange={(value) => setFormData({ ...formData, orgId: value })}
                value={formData.orgId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.organizationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading doctors...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No doctors found</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Specialty</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">Organization</th>
                    <th className="text-left py-3 px-4 font-semibold">Country</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr
                      key={d.id || d._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{d.name}</td>
                      <td className="py-3 px-4">{d.specialty}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> +{d.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4">{d.organizationName || "—"}</td>
                      <td className="py-3 px-4">{d.country}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(d.id || d._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EA_Doctors;
