import { useEffect, useMemo, useState } from "react";
import {
  Search,
  HeartPulse,
  RefreshCcw,
  Plus,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

import { viewOrganization } from "@/services/organization.service";
import {
  createNurse,
  deleteNurse,
  updateNurse,
} from "@/services/nurse.service";
import { getUserPermissions } from "@/services/permission.service";
import { apiRequest } from "@/lib/api-request";

import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

/**
 * 💉 Cluster Head – Nurses Management Page
 * - Lists all nurses under the Cluster Head's organization.
 * - Allows add (with OTP), edit (phone/devices/status), delete.
 * - Permissions come from the Cluster Head's userId.
 */
const CH_Nurses = () => {
  const { toast } = useToast();

  // ───────────────────────── State ─────────────────────────
  const [loading, setLoading] = useState(true);
  const [orgLoading, setOrgLoading] = useState(true);

  const [nurses, setNurses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [orgDevices, setOrgDevices] = useState<
    { _id: string; name: string; deviceCode: string }[]
  >([]);

  const [clusterHeadUserId, setClusterHeadUserId] = useState<string | null>(
    null
  );

  // Permissions for NEW nurse (based on cluster-head)
  const [permissionsNew, setPermissionsNew] = useState<string[]>([]);
  const [selectedPermissionsNew, setSelectedPermissionsNew] = useState<
    string[]
  >([]);

  // ── Add Nurse dialog state ──
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "verify">("form");
  const [addOtp, setAddOtp] = useState("");
  const [pendingNursePhone, setPendingNursePhone] = useState<{
    phone_country: string;
    phone_number: string;
  } | null>(null);

  const [addForm, setAddForm] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
    devices: [] as string[],
  });

  // ── Edit Nurse dialog state ──
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNurse, setEditingNurse] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    phone_country: "91",
    phone_number: "",
    status: "Active",
    devices: [] as string[],
  });
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [selectedPermissionsEdit, setSelectedPermissionsEdit] = useState<
    string[]
  >([]);

  // ───────────────────────── Fetch Org + Nurses ─────────────────────────
  const fetchOrgAndNurses = async () => {
    setOrgLoading(true);
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) {
        throw new Error("Organization ID missing in localStorage");
      }

      const res = await viewOrganization(orgId);
      const org = res.organization || res;

      const orgNurses = org.nurse || [];
      const devices = org.devices || [];
      const chUserId = org.userId?._id || null;

      setNurses(orgNurses);
      setOrgDevices(devices);
      setClusterHeadUserId(chUserId);

      // Fetch permissions for NEW nurse from Cluster Head userId
      if (chUserId) {
        try {
          const perms = await getUserPermissions(chUserId);
          setPermissionsNew(perms);
          setSelectedPermissionsNew(perms); // auto-select all by default
        } catch (e) {
          console.error("Error fetching cluster-head permissions", e);
        }
      }
    } catch (err: any) {
      console.error("❌ Error loading organization/nurses:", err);
      toast({
        title: "Failed to load nurses",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setOrgLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgAndNurses();
  }, []);

  // ───────────────────────── Filter Logic ─────────────────────────
  const filteredNurses = useMemo(() => {
    if (!searchTerm.trim()) return nurses;

    const q = searchTerm.toLowerCase();
    return nurses.filter((n: any) => {
      return (
        n.name?.toLowerCase().includes(q) ||
        n.phone_number?.join("").includes(q) ||
        n.country?.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, nurses]);

  // ───────────────────────── Add Nurse: Step 1 (send OTP) ─────────────────────────
  const handleAddNurseSubmit = async () => {
    const { name, phone_country, phone_number, password, country, devices } =
      addForm;

    if (!name || !phone_number || !password || devices.length === 0) {
      toast({
        title: "Missing fields",
        description:
          "Please fill name, phone, password and select at least one device.",
        variant: "destructive",
      });
      return;
    }

    const orgId = localStorage.getItem("organizationId");
    if (!orgId) {
      toast({
        title: "Missing organization",
        description: "Organization ID is not set.",
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
        permissions: selectedPermissionsNew,
        devices,
      };

      await createNurse(payload);
      setPendingNursePhone({ phone_country, phone_number });
      setAddStep("verify");
      toast({ title: "OTP sent to nurse phone number" });
    } catch (err: any) {
      console.error("Error creating nurse:", err);
      toast({
        title: "Error creating nurse",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Add Nurse: Step 2 (verify OTP) ─────────────────────────
  const handleVerifyAddOtp = async () => {
    if (!addOtp.trim()) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP sent to nurse.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("/api/auth/create/verify-nurse", {
        method: "POST",
        data: { otp: addOtp },
      });

      toast({ title: "Nurse created successfully" });

      // Reset dialog + form
      setAddDialogOpen(false);
      setAddStep("form");
      setAddOtp("");
      setPendingNursePhone(null);
      setAddForm({
        name: "",
        phone_country: "91",
        phone_number: "",
        password: "",
        country: "India",
        devices: [],
      });

      // Refresh list
      fetchOrgAndNurses();
    } catch (err: any) {
      console.error("Error verifying nurse OTP:", err);
      toast({
        title: "Failed to verify OTP",
        description: err.message || "Please check the OTP.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Open Edit Dialog ─────────────────────────
  const openEditDialog = async (nurse: any) => {
    setEditingNurse(nurse);

    const [cc = "91", pn = ""] = Array.isArray(nurse.phone_number || [])
      ? nurse.phone_number
      : ["91", ""];

    // Pre-fill edit form fields
    const currentDevices: string[] = Array.isArray(nurse.devices)
      ? nurse.devices.map((d: any) => (typeof d === "string" ? d : d._id))
      : [];

    setEditForm({
      phone_country: cc,
      phone_number: pn,
      status: nurse.status || "Active",
      devices: currentDevices,
    });

    // Load nurse's existing permissions via userId = nurse._id
    try {
      const perms = await getUserPermissions(nurse._id || nurse.id);
      setEditPermissions(perms);
      setSelectedPermissionsEdit(perms);
    } catch (err) {
      console.error("Error fetching nurse permissions:", err);
    }

    setEditDialogOpen(true);
  };

  // ───────────────────────── Save Edit ─────────────────────────
  const handleSaveEdit = async () => {
    if (!editingNurse) return;

    const { phone_country, phone_number, status, devices } = editForm;

    if (!phone_number) {
      toast({
        title: "Phone number required",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: any = {
        phone_number: [phone_country, phone_number],
        status,
        devices,
        permissions: selectedPermissionsEdit,
      };

      await updateNurse(editingNurse._id || editingNurse.id, payload);

      toast({ title: "Nurse updated successfully" });
      setEditDialogOpen(false);
      setEditingNurse(null);

      fetchOrgAndNurses();
    } catch (err: any) {
      console.error("Error updating nurse:", err);
      toast({
        title: "Failed to update nurse",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Delete Nurse ─────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this nurse?")) return;
    try {
      await deleteNurse(id);
      toast({ title: "Nurse deleted successfully" });
      fetchOrgAndNurses();
    } catch (err: any) {
      console.error("Error deleting nurse:", err);
      toast({
        title: "Failed to delete nurse",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Render ─────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" />
            Nurses
          </h1>
          <p className="text-muted-foreground mt-1">
            View, add, edit and manage all nurses under your organization.
          </p>
        </div>

        {/* Add Nurse Dialog */}
        <Dialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open);
            if (!open) {
              // reset on close
              setAddStep("form");
              setAddOtp("");
              setPendingNursePhone(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Nurse
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {addStep === "form" ? "Add Nurse" : "Verify OTP"}
              </DialogTitle>
            </DialogHeader>

            {addStep === "form" ? (
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Full Name"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                />

                <div className="flex gap-2">
                  <Input
                    placeholder="Country Code"
                    value={addForm.phone_country}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        phone_country: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={addForm.phone_number}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  placeholder="Password"
                  type="password"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm({ ...addForm, password: e.target.value })
                  }
                />

                {/* Device selection */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-between"
                      disabled={orgDevices.length === 0}
                    >
                      {addForm.devices.length > 0
                        ? `${addForm.devices.length} device(s) selected`
                        : orgDevices.length > 0
                        ? "Select Devices"
                        : "No devices available"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid gap-2 max-h-56 overflow-y-auto">
                      {orgDevices.map((device) => (
                        <label
                          key={device._id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={addForm.devices.includes(device._id)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...addForm.devices, device._id]
                                : addForm.devices.filter(
                                    (id) => id !== device._id
                                  );
                              setAddForm({ ...addForm, devices: updated });
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

                {/* Permissions from cluster-head */}
                {permissionsNew.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-medium mb-2 text-sm">
                      Assign Nurse Permissions
                    </h4>
                    <div className="grid gap-2 max-h-40 overflow-y-auto">
                      {permissionsNew.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedPermissionsNew.includes(perm)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...selectedPermissionsNew, perm]
                                : selectedPermissionsNew.filter(
                                    (p) => p !== perm
                                  );
                              setSelectedPermissionsNew(updated);
                            }}
                          />
                          <span className="text-xs">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <p className="text-muted-foreground text-sm">
                  Enter the OTP sent to +
                  {pendingNursePhone?.phone_country}{" "}
                  {pendingNursePhone?.phone_number}
                </p>
                <Input
                  placeholder="Enter OTP"
                  value={addOtp}
                  onChange={(e) => setAddOtp(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              {addStep === "form" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddNurseSubmit}>Next</Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddStep("form");
                      setAddOtp("");
                    }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleVerifyAddOtp}>Verify</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      {!orgLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Nurses"
            value={nurses.length.toString()}
            icon={HeartPulse}
            variant="primary"
            trend={{ value: "All registered", isPositive: true }}
          />
          <StatCard
            title="Active"
            value={nurses
              .filter((n: any) => n.status === "Active")
              .length.toString()}
            icon={HeartPulse}
            variant="success"
            trend={{ value: "Currently working", isPositive: true }}
          />
          <StatCard
            title="Inactive"
            value={nurses
              .filter((n: any) => n.status !== "Active")
              .length.toString()}
            icon={HeartPulse}
            variant="warning"
            trend={{ value: "Need review", isPositive: false }}
          />
        </div>
      )}

      {/* Search + Refresh */}
      <div className="flex justify-between items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchOrgAndNurses}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCcw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Nurses table */}
      <div className="bg-card rounded-lg shadow-card p-6">
        <h3 className="text-xl font-semibold mb-4">All Nurses</h3>

        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            Loading nurses...
          </div>
        ) : filteredNurses.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No nurses found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Country</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Date Created
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((n: any, i: number) => (
                  <tr
                    key={n._id || n.id || i}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{n.name || "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {Array.isArray(n.phone_number)
                        ? `+${n.phone_number.join(" ")}`
                        : "—"}
                    </td>
                    <td className="py-3 px-4">{n.country || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          n.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {n.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {n.date_created || n.createdAt
                        ? new Date(
                            n.date_created || n.createdAt
                          ).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(n)}
                        title="Edit nurse"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(n._id || n.id || "")
                        }
                        title="Delete nurse"
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
      </div>

      {/* Edit Nurse Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingNurse(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Nurse</DialogTitle>
          </DialogHeader>

          {editingNurse && (
            <div className="grid gap-4 py-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium">{editingNurse.name}</p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Country Code"
                  value={editForm.phone_country}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      phone_country: e.target.value,
                    })
                  }
                  className="w-20"
                />
                <Input
                  placeholder="Phone Number"
                  value={editForm.phone_number}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>

              {/* Status select */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Devices */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Devices</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {editForm.devices.length > 0
                        ? `${editForm.devices.length} device(s) selected`
                        : "Select Devices"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid gap-2 max-h-56 overflow-y-auto">
                      {orgDevices.map((device) => (
                        <label
                          key={device._id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={editForm.devices.includes(device._id)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...editForm.devices, device._id]
                                : editForm.devices.filter(
                                    (id) => id !== device._id
                                  );
                              setEditForm({ ...editForm, devices: updated });
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
              </div>

              {/* Permissions for edit (if loaded) */}
              {editPermissions.length > 0 && (
                <div className="mt-2 border-t pt-3">
                  <h4 className="font-medium mb-2 text-sm">
                    Permissions for this nurse
                  </h4>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {editPermissions.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedPermissionsEdit.includes(perm)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...selectedPermissionsEdit, perm]
                              : selectedPermissionsEdit.filter(
                                  (p) => p !== perm
                                );
                            setSelectedPermissionsEdit(updated);
                          }}
                        />
                        <span className="text-xs">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CH_Nurses;
