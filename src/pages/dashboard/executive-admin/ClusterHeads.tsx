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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Edit,
  MapPin,
  Building2,
  Trash2,
  Phone,
  KeyRound,
} from "lucide-react";
import {
  listClusterHeads,
  createClusterHead,
  verifyClusterHead,
  deleteClusterHead,
} from "@/services/clusterHead.service";
import { getPermissions } from "@/services/permission.service";

interface ClusterHead {
  _id: string;
  name: string;
  phone_number: string[];
  organization?: {
    organizationName: string;
    organizationCode?: string;
    location?: {
      line1?: string;
      line2?: string;
      line3?: string;
    };
    status?: string;
  };
}

const ClusterHeads = () => {
  const { toast } = useToast();

  // ====== States ======
  const [clusterHeads, setClusterHeads] = useState<ClusterHead[]>([]);
  const [filtered, setFiltered] = useState<ClusterHead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [createdPhone, setCreatedPhone] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
    organizationName: "",
    location: { line1: "", line2: "", line3: "" },
  });

  // ====== Fetch Cluster Heads ======
  const fetchClusterHeads = async () => {
    setLoading(true);
    try {
      const data = await listClusterHeads();
      const clusterList = data.clusters || [];
      setClusterHeads(clusterList);
      setFiltered(clusterList);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load cluster heads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ====== Fetch Permissions ======
  const fetchPermissions = async () => {
  try {
    const data = await getPermissions();

    // ✅ Safely handle multiple possible backend structures
    const permissionList =
      Array.isArray(data)
        ? data
        : Array.isArray(data.permissions)
        ? data.permissions
        : Array.isArray(data.data)
        ? data.data
        : [];

    setPermissions(permissionList);
  } catch (err) {
    console.error("Error fetching permissions:", err);
    setPermissions([]); // fallback
  }
};


  useEffect(() => {
    fetchClusterHeads();
    fetchPermissions();
  }, []);

  // ====== Search Filter ======
  useEffect(() => {
    if (!search.trim()) setFiltered(clusterHeads);
    else {
      setFiltered(
        clusterHeads.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, clusterHeads]);

  // ====== Create Cluster Head ======
  const handleSubmit = async () => {
    const {
      name,
      phone_country,
      phone_number,
      password,
      country,
      organizationName,
      location,
    } = formData;

    if (!name || !phone_number || !password || !organizationName) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        phone_number: [phone_country, phone_number],
        permissions: selectedPermissions.length
          ? selectedPermissions
          : ["view-organizations"],
        password,
        name,
        country,
        organizationName,
        location,
      };

      await createClusterHead(payload);
      setCreatedPhone(`${phone_country}${phone_number}`);
      setVerifyDialog(true);
      setDialogOpen(false);
      toast({
        title: "Cluster Head Created",
        description: "Please verify OTP to activate the account.",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error creating cluster head", variant: "destructive" });
    }
  };

  // ====== Verify OTP ======
  const handleVerify = async () => {
    if (!otpCode) {
      toast({ title: "Enter OTP code", variant: "destructive" });
      return;
    }
    try {
      await verifyClusterHead({
        phone_number: createdPhone,
        code: otpCode,
      });
      toast({ title: "Cluster Head verified successfully" });
      setVerifyDialog(false);
      setOtpCode("");
      fetchClusterHeads();
    } catch (err) {
      console.error(err);
      toast({ title: "Invalid or expired OTP", variant: "destructive" });
    }
  };

  // ====== Delete Cluster Head ======
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cluster head?")) return;
    try {
      await deleteClusterHead(id);
      toast({ title: "Cluster head deleted" });
      fetchClusterHeads();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete cluster head", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" /> Cluster Heads
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage cluster heads and their associated organizations
          </p>
        </div>

        {/* Create Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Cluster Head
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Cluster Head</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3 py-2">
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
              <Input
                placeholder="Organization Name"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizationName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Location Line 1"
                value={formData.location.line1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, line1: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Location Line 2"
                value={formData.location.line2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, line2: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Location Line 3"
                value={formData.location.line3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, line3: e.target.value },
                  })
                }
              />

              {/* Permissions */}
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Permissions:</p>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                  {permissions.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions((prev) =>
                            checked
                              ? [...prev, perm]
                              : prev.filter((p) => p !== perm)
                          );
                        }}
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
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

      {/* OTP Verification */}
      <Dialog open={verifyDialog} onOpenChange={setVerifyDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Input
              placeholder="Enter OTP Code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify}>
              <KeyRound className="h-4 w-4 mr-1" /> Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cluster heads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cluster Heads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading cluster heads...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cluster heads found
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
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{c.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                        <Phone className="h-4 w-4" /> +{c.phone_number?.join(" ")}
                      </td>
                      <td className="py-3 px-4">
                        {c.organization?.organizationName || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {[
                          c.organization?.location?.line1,
                          c.organization?.location?.line2,
                          c.organization?.location?.line3,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c._id)}
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

export default ClusterHeads;
