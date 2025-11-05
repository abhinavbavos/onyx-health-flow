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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  Phone,
  Shield,
  Cpu,
} from "lucide-react";

import {
  createUserHead,
  deleteUserHead,
  listUserHeads,
  verifyUserHead,
} from "@/services/userHead.service";
import { listOrganizations } from "@/services/organization.service";
import { getUserPermissions } from "@/services/permission.service";

interface UserHead {
  id?: string;
  _id?: string;
  name: string;
  phone_number: string[];
  country: string;
  orgId?: string;
  organizationName?: string;
  status: string;
}

interface Organization {
  id?: string;
  _id?: string;
  organizationName: string;
  devices?: { _id: string; name: string; deviceCode?: string }[];
  userId?: { _id: string; name: string };
}

const UserHeads = () => {
  const { toast } = useToast();
  const [userHeads, setUserHeads] = useState<UserHead[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<UserHead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<{
    phone_country: string;
    phone_number: string;
  }>({
    phone_country: "",
    phone_number: "",
  });
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
    orgId: "",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // ================================
  // Fetch all user heads
  // ================================
  const fetchUserHeads = async () => {
    setLoading(true);
    try {
      const data = await listUserHeads();

      // Accept multiple response shapes:
      // - an array
      // - an object with { user_heads: [...] }
      const userHeadsArray: any[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any).user_heads)
        ? (data as any).user_heads
        : [];

      const normalized = userHeadsArray.map((u: any) => ({
        ...u,
        id: u._id || u.id,
        // Ensure phone_number is always an array
        phone_number: Array.isArray(u.phone_number)
          ? u.phone_number
          : u.phone_number
          ? [u.phone_country || "91", String(u.phone_number)]
          : [],
        country: u.country || "—",
        // prefer nested organization name if present
        organizationName:
          u.organization?.organizationName || u.organizationName || undefined,
        organization: u.organization || undefined,
      }));

      setUserHeads(normalized);
      setFiltered(normalized);
    } catch (err) {
      toast({ title: "Failed to load user heads", variant: "destructive" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Fetch organizations (with devices)
  // ================================
  const fetchOrganizations = async () => {
    try {
      const data = await listOrganizations();
      const orgList = Array.isArray(data?.organizations)
        ? data.organizations
        : Array.isArray(data)
        ? data
        : [];
      setOrganizations(orgList);
    } catch (err) {
      console.error(err);
      toast({ title: "Error fetching organizations", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUserHeads();
    fetchOrganizations();
  }, []);

  // ================================
  // Handle organization selection → fetch devices & permissions
  // ================================
  const handleOrgSelect = async (orgId: string) => {
    setFormData({ ...formData, orgId });
    setSelectedDevices([]);
    setSelectedPermissions([]);
    setDevices([]);

    const selectedOrg = organizations.find(
      (o) => o.id === orgId || o._id === orgId
    );
    setDevices(selectedOrg?.devices || []);

    if (!selectedOrg?.userId?._id) return;

    try {
      const perms = await getUserPermissions(selectedOrg.userId._id);
      setPermissions(perms);
      setSelectedPermissions(perms); // auto-select all
    } catch (err) {
      console.error("Failed to load permissions:", err);
      toast({ title: "Error fetching permissions", variant: "destructive" });
    }
  };

  // ================================
  // Search filter
  // ================================
  useEffect(() => {
    if (search.trim() === "") setFiltered(userHeads);
    else {
      const filteredList = userHeads.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredList);
    }
  }, [search, userHeads]);

  // ================================
  // Toggle handlers
  // ================================
  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // ================================
  // Create User Head
  // ================================
  const handleSubmit = async () => {
    const { name, phone_country, phone_number, password, orgId, country } =
      formData;

    if (!name || !phone_number || !password || !orgId) {
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
        devices: selectedDevices,
      };

      await createUserHead(payload);
      toast({ title: "OTP sent", description: "Please verify the user head" });
      setPendingUser({ phone_country, phone_number });
      setOtpDialogOpen(true);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating User Head", variant: "destructive" });
    }
  };

  // ================================
  // Verify OTP
  // ================================
  const handleVerifyOtp = async () => {
    try {
      await verifyUserHead({ otp });
      toast({ title: "✅ User Head verified successfully" });
      setOtpDialogOpen(false);
      setOtp("");
      fetchUserHeads();
    } catch (err) {
      console.error(err);
      toast({ title: "Invalid or expired OTP", variant: "destructive" });
    }
  };

  // ================================
  // Delete User Head
  // ================================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this User Head?")) return;
    try {
      await deleteUserHead(id);
      toast({ title: "User Head deleted" });
      fetchUserHeads();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" /> User Heads
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage User Heads under specific organizations
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add User Head
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create User Head</DialogTitle>
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
                  placeholder="Country Code"
                  value={formData.phone_country}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_country: e.target.value })
                  }
                  className="w-20"
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
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

              {/* Organization Select */}
              <Select
                onValueChange={(value) => handleOrgSelect(value)}
                value={formData.orgId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem
                      key={org.id || org._id}
                      value={org.id || org._id}
                    >
                      {org.organizationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Permissions */}
              {permissions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-primary" /> Assign
                    Permissions
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto border rounded-md p-2">
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
                </div>
              )}

              {/* Devices */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Cpu className="h-4 w-4 text-primary" /> Assign Devices
                </p>
                {devices.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No devices available for this organization
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto border rounded-md p-2">
                    {devices.map((device) => (
                      <label
                        key={device._id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Checkbox
                          checked={selectedDevices.includes(device._id)}
                          onCheckedChange={() => toggleDevice(device._id)}
                        />
                        <span>{device.name || device.deviceName}</span>
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

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the OTP sent to +{pendingUser.phone_country}{" "}
              {pendingUser.phone_number}.
            </p>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyOtp}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user heads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All User Heads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading user heads...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No user heads found
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
                  {filtered.map((u) => (
                    <tr
                      key={u.id || u._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> +
                        {u.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4">
                        {u.organizationName || "—"}
                      </td>
                      <td className="py-3 px-4">{u.country}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(u.id || u._id || "")}
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

export default UserHeads;
