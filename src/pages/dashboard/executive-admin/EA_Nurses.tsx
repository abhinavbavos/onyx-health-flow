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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Edit, Trash2, HeartPulse, Phone } from "lucide-react";
import { createNurse, deleteNurse, listNurses } from "@/services/nurse.service";
import { listOrganizations } from "@/services/organization.service";
import { getUserPermissions } from "@/services/permission.service";
import { apiRequest } from "@/lib/api-request";

interface Nurse {
  _id?: string;
  id?: string;
  name: string;
  phone_number: string[];
  country: string;
  organizationName?: string;
  status: string;
  organization?: {
    _id?: string;
    organizationName?: string;
  };
}

interface Organization {
  id: string;
  organizationName: string;
  devices?: { _id: string; name: string; deviceCode: string }[];
  userId?: { _id: string; name: string };
}

const EA_Nurses = () => {
  const { toast } = useToast();
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filtered, setFiltered] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // dialog + form states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingNurse, setPendingNurse] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");

  // permissions
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
    orgId: "",
    devices: [] as string[],
  });

  // ================================
  // Fetch nurses + organizations
  // ================================
  const fetchNurses = async () => {
    setLoading(true);
    try {
      const data = await listNurses();
      // listNurses may return { nurses: [...] } or an array - normalize both
      const nursesArray: any[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any).nurses)
        ? (data as any).nurses
        : [];

      const normalized = nursesArray.map((n: any) => ({
        ...n,
        // prefer nested organization name if present
        organizationName:
          n.organization?.organizationName || n.organizationName || undefined,
        organization: n.organization || undefined,
      }));

      setNurses(normalized);
      setFiltered(normalized);
    } catch (err) {
      toast({ title: "Failed to load nurses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const data = await listOrganizations();
      const orgs = Array.isArray(data.organizations)
        ? data.organizations
        : data;
      setOrganizations(orgs);
    } catch (err) {
      toast({ title: "Error fetching organizations", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchNurses();
    fetchOrganizations();
  }, []);

  // ================================
  // Search
  // ================================
  useEffect(() => {
    if (search.trim() === "") setFiltered(nurses);
    else {
      setFiltered(
        nurses.filter((n) =>
          n.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, nurses]);

  // ================================
  // When organization changes → get permissions
  // ================================
  const handleOrgSelect = async (orgId: string) => {
    setFormData({ ...formData, orgId, devices: [] });
    setPermissions([]);
    setSelectedPermissions([]);

    const org = organizations.find((o) => o.id === orgId || o._id === orgId);
    if (!org || !org.userId?._id) return;

    try {
      const perms = await getUserPermissions(org.userId._id);
      setPermissions(perms);
      setSelectedPermissions(perms); // ✅ auto-select all
    } catch (err) {
      console.error("Failed to load permissions:", err);
      toast({ title: "Error loading permissions", variant: "destructive" });
    }
  };

  // ================================
  // Create Nurse (Step 1)
  // ================================
  const handleCreate = async () => {
    const {
      name,
      phone_country,
      phone_number,
      password,
      orgId,
      devices,
      country,
    } = formData;

    if (!name || !phone_number || !password || !orgId || devices.length === 0) {
      toast({
        title: "Please fill all required fields",
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
        orgId,
        permissions: selectedPermissions,
        devices,
      };

      await createNurse(payload);
      setPendingNurse({ phone_country, phone_number });
      setStep("verify");
      toast({ title: "OTP sent successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating nurse", variant: "destructive" });
    }
  };

  // ================================
  // Verify OTP (Step 2)
  // ================================
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: "Please enter OTP", variant: "destructive" });
      return;
    }

    try {
      await apiRequest("/api/auth/create/verify-nurse", {
        method: "POST",
        data: { otp },
      });

      toast({ title: "Nurse verified & created successfully" });
      setDialogOpen(false);
      setStep("form");
      setOtp("");
      setPendingNurse(null);
      setFormData({
        name: "",
        phone_country: "91",
        phone_number: "",
        password: "",
        country: "India",
        orgId: "",
        devices: [],
      });
      fetchNurses();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to verify OTP", variant: "destructive" });
    }
  };

  // ================================
  // Delete Nurse
  // ================================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this nurse?")) return;
    try {
      await deleteNurse(id);
      toast({ title: "Nurse deleted successfully" });
      fetchNurses();
    } catch (err) {
      toast({ title: "Failed to delete nurse", variant: "destructive" });
    }
  };

  interface Organization {
    id: string;
    _id: string;
    organizationName: string;
    devices?: { _id: string; name: string; deviceCode: string }[];
    userId?: { _id: string }; // Added userId property
  }
  
  const selectedOrg: Organization =
    organizations.find(
      (o) => o.id === formData.orgId || o._id === formData.orgId
    ) || { id: "", _id: "", organizationName: "", devices: [] };

  // ================================
  // UI
  // ================================
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" /> Nurses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage nurses and assign them to organizations and devices.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Nurse
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {step === "form" ? "Add Nurse" : "Verify OTP"}
              </DialogTitle>
            </DialogHeader>

            {step === "form" ? (
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
                    placeholder="Country Code"
                    value={formData.phone_country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone_country: e.target.value,
                      })
                    }
                    className="w-20"
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
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                {/* Organization */}
                <Select
                  onValueChange={(value) => handleOrgSelect(value)}
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

                {/* Devices */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-between"
                      disabled={!selectedOrg.devices?.length}
                    >
                      {formData.devices.length > 0
                        ? `${formData.devices.length} device(s) selected`
                        : selectedOrg.devices?.length
                        ? "Select Devices"
                        : "No devices available"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid gap-2">
                      {selectedOrg.devices?.map((device) => (
                        <label
                          key={device._id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={formData.devices.includes(device._id)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...formData.devices, device._id]
                                : formData.devices.filter(
                                    (id) => id !== device._id
                                  );
                              setFormData({ ...formData, devices: updated });
                            }}
                          />
                          <span className="text-sm">
                            {device.name} ({device.deviceCode})
                          </span>
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Permissions */}
                {permissions.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-medium mb-2 text-sm">
                      Assign Permissions
                    </h4>
                    <div className="grid gap-2">
                      {permissions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedPermissions.includes(perm)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...selectedPermissions, perm]
                                : selectedPermissions.filter((p) => p !== perm);
                              setSelectedPermissions(updated);
                            }}
                          />
                          <span className="text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-sm">
                  Enter the OTP sent to +{pendingNurse?.phone_country}{" "}
                  {pendingNurse?.phone_number}
                </p>
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              {step === "form" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Next</Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("form");
                      setOtp("");
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleVerifyOtp}>Verify</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nurses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Nurses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading nurses...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No nurses found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Organization
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((n) => (
                    <tr
                      key={n.id || n._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{n.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> +
                        {n.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4">
                        {n.organization?.organizationName ||
                          n.organizationName ||
                          "—"}
                      </td>
                      <td className="py-3 px-4">{n.country}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(n.id || n._id || "")}
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

export default EA_Nurses;
