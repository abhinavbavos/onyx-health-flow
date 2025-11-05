import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import {
  listTechnicians,
  createTechnician,
  deleteTechnician,
} from "@/services/technician.service";
import { listPermissions } from "@/services/permission.service";
import { Checkbox } from "@/components/ui/checkbox";

interface Technician {
  _id?: string;
  name: string;
  phone_number: string[];
  country: string;
  status?: string;
  permissions?: string[];
}

const Technicians = () => {
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filtered, setFiltered] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
  });

  /* ================================
     Fetch All Technicians
  ================================ */
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const data = await listTechnicians();

      // Accept multiple response shapes:
      // - an array
      // - an object with { technicians: [...] }
      const techniciansArray: any[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any).technicians)
        ? (data as any).technicians
        : [];

      const normalized = techniciansArray.map((t: any) => ({
        ...t,
        // canonical id
        id: t._id || t.id,
        // ensure phone_number is an array like ["91", "956..."]
        phone_number: Array.isArray(t.phone_number)
          ? t.phone_number
          : t.phone_number
          ? [t.phone_country || "91", String(t.phone_number)]
          : [],
        // ensure country is present
        country: t.country || t.countryCode || "—",
        // prefer nested organization name if present
        organizationName:
          t.organization?.organizationName || t.organizationName || undefined,
        organization: t.organization || undefined,
      }));

      setTechnicians(normalized);
      setFiltered(normalized);
    } catch (err) {
      toast({ title: "Failed to load technicians", variant: "destructive" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     Fetch Permissions
  ================================ */
  const fetchPermissions = async () => {
    try {
      const data = await listPermissions();

      // Normalize to array
      let list: string[] = [];

      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.permissions)) list = data.permissions;
      else if (data?.permissions && typeof data.permissions === "object")
        list = Object.keys(data.permissions);
      else list = [];

      console.log("✅ Normalized permissions list:", list);

      setPermissions(list);
    } catch (err) {
      console.error("❌ Error fetching permissions:", err);
      toast({ title: "Error fetching permissions", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchTechnicians();
    fetchPermissions();
  }, []);

  /* ================================
     Search Filter
  ================================ */
  useEffect(() => {
    if (search.trim() === "") setFiltered(technicians);
    else {
      setFiltered(
        technicians.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, technicians]);

  /* ================================
     Create Technician
  ================================ */
  const handleSubmit = async () => {
    const { name, phone_country, phone_number, password, country } = formData;

    if (!name || !phone_number || !password) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "Please select at least one permission",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        phone_number: [phone_country, phone_number],
        password,
        name,
        country,
        permissions: selectedPermissions,
      };

      await createTechnician(payload);
      toast({ title: "Technician created successfully" });

      // Reset form
      setDialogOpen(false);
      setFormData({
        name: "",
        phone_country: "91",
        phone_number: "",
        password: "",
        country: "India",
      });
      setSelectedPermissions([]);

      fetchTechnicians();
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating technician", variant: "destructive" });
    }
  };

  /* ================================
     Delete Technician
  ================================ */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this technician?")) return;

    try {
      await deleteTechnician(id);
      toast({ title: "Technician deleted" });
      fetchTechnicians();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete technician", variant: "destructive" });
    }
  };

  /* ================================
     Toggle Permission Selection
  ================================ */
  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  /* ================================
     UI
  ================================ */
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-7 w-7 text-primary" /> Technicians
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all technicians created under your supervision
          </p>
        </div>

        {/* Add Technician Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add Technician</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <div className="flex gap-2">
                <Input
                  placeholder="Code"
                  className="w-20"
                  value={formData.phone_country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_country: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>

              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {/* Permissions */}
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">Assign Permissions</p>
                </div>

                {permissions.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Loading permissions...
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                    {permissions.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                        />
                        <span>{perm}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
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
            placeholder="Search technicians..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Technicians</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading technicians...
            </div>
          ) : !Array.isArray(filtered) || filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No technicians found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> +
                        {t.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4">{t.country}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(t._id)}
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

export default Technicians;
