import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  RefreshCcw,
  Plus,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

import { viewOrganization } from "@/services/organization.service";
import {
  sendTechnicianOTP,
  deleteTechnician,
  verifyTechnicianOTP,
  listTechnicians,
} from "@/services/technician.service";
import { getUserPermissions } from "@/services/permission.service";
import { apiRequest } from "@/lib/api-request";
import { resendOtp } from "@/services/auth.service";
import { cn } from "@/lib/utils";

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
import { Checkbox } from "@/components/ui/checkbox";

/**
 * 🛠️ Cluster Head – Technicians Management Page
 */
const CH_Technicians = () => {
  const { toast } = useToast();

  // ───────────────────────── State ─────────────────────────
  const [loading, setLoading] = useState(true);
  const [orgLoading, setOrgLoading] = useState(true);

  const [technicians, setTechnicians] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [clusterHeadUserId, setClusterHeadUserId] = useState<string | null>(
    null
  );

  // Permissions for NEW technician
  const [permissionsNew, setPermissionsNew] = useState<string[]>([]);
  const [selectedPermissionsNew, setSelectedPermissionsNew] = useState<
    string[]
  >([]);

  // ── Add Technician dialog state ──
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "verify">("form");
  const [addOtp, setAddOtp] = useState("");
  const [pendingTechPhone, setPendingTechPhone] = useState<{
    phone_country: string;
    phone_number: string;
  } | null>(null);

  const [addForm, setAddForm] = useState({
    name: "",
    phone_country: "91",
    phone_number: "",
    password: "",
    country: "India",
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !pendingTechPhone) return;
    try {
      await resendOtp([pendingTechPhone.phone_country, pendingTechPhone.phone_number]);
      setResendTimer(30);
      toast({ title: "OTP Resent" });
    } catch (err: any) {
      toast({ title: "Failed to resend OTP", variant: "destructive" });
    }
  };

  // ───────────────────────── Fetch Org + Technicians ─────────────────────────
  const fetchOrgAndTechnicians = async () => {
    setOrgLoading(true);
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) {
        throw new Error("Organization ID missing in localStorage");
      }

      const res = await viewOrganization(orgId);
      const org = res.organization || res;
      const chUserId = org.userId?._id || null;

      // Fetch technicians using the dedicated service instead of organization object
      const allTechs = await listTechnicians();
      
      setTechnicians(allTechs);
      setClusterHeadUserId(chUserId);

      // Fetch permissions for NEW technician from Cluster Head userId
      if (chUserId) {
        try {
          const perms = await getUserPermissions(chUserId);
          setPermissionsNew(perms);
          setSelectedPermissionsNew([]); // Start empty
        } catch (e) {
          console.error("Error fetching cluster-head permissions", e);
        }
      }
    } catch (err: any) {
      console.error("❌ Error loading organization/technicians:", err);
      toast({
        title: "Failed to load technicians",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setOrgLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgAndTechnicians();
  }, []);

  // ───────────────────────── Filter Logic ─────────────────────────
  const filteredTechs = useMemo(() => {
    if (!searchTerm.trim()) return technicians;

    const q = searchTerm.toLowerCase();
    return technicians.filter((t: any) => {
      return (
        t.name?.toLowerCase().includes(q) ||
        t.phone_number?.join("").includes(q) ||
        t.country?.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, technicians]);

  // ───────────────────────── Add Technician: Step 1 (send OTP) ─────────────────────────
  const handleAddTechSubmit = async () => {
    const { name, phone_country, phone_number, password, country } = addForm;

    if (!name || !phone_number || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill name, phone, and password.",
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

    if (selectedPermissionsNew.length === 0) {
      toast({
        title: "Permissions required",
        description: "Please select at least one permission for the technician.",
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
        permissions: selectedPermissionsNew,
      };

      await sendTechnicianOTP(payload);
      setPendingTechPhone({ phone_country, phone_number });
      setAddStep("verify");
      setResendTimer(30);
      toast({ title: "OTP sent to technician phone number" });
    } catch (err: any) {
      console.error("Error creating technician:", err);
      toast({
        title: "Error creating technician",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Add Technician: Step 2 (verify OTP) ─────────────────────────
  const handleVerifyAddOtp = async () => {
    if (!addOtp.trim()) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP sent to technician.",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyTechnicianOTP({ otp: addOtp });

      toast({ title: "Technician created successfully" });

      // Reset dialog + form
      setAddDialogOpen(false);
      setAddStep("form");
      setAddOtp("");
      setPendingTechPhone(null);
      setAddForm({
        name: "",
        phone_country: "91",
        phone_number: "",
        password: "",
        country: "India",
      });

      // Refresh list
      fetchOrgAndTechnicians();
    } catch (err: any) {
      console.error("Error verifying technician OTP:", err);
      toast({
        title: "Failed to verify OTP",
        description: err.message || "Please check the OTP.",
        variant: "destructive",
      });
    }
  };

  // ───────────────────────── Delete Technician ─────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technician?")) return;
    try {
      await deleteTechnician(id);
      toast({ title: "Technician deleted successfully" });
      fetchOrgAndTechnicians();
    } catch (err: any) {
      console.error("Error deleting technician:", err);
      toast({
        title: "Failed to delete technician",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Technicians
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all technicians under your organization.
          </p>
        </div>

        <Dialog
          open={addDialogOpen}
          onOpenChange={(open) => {
            setAddDialogOpen(open);
            if (!open) {
              setAddStep("form");
              setAddOtp("");
              setPendingTechPhone(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {addStep === "form" ? "Add Technician" : "Verify OTP"}
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
                    placeholder="CC"
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

                {/* Permissions */}
                {permissionsNew.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-medium mb-2 text-sm">
                      Assign Technician Permissions
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
                  {pendingTechPhone?.phone_country}{" "}
                  {pendingTechPhone?.phone_number}
                </p>
                <Input
                  placeholder="Enter OTP"
                  value={addOtp}
                  onChange={(e) => setAddOtp(e.target.value)}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className={cn(
                      "text-xs font-bold transition-all",
                      resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-primary hover:underline"
                    )}
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Didn't receive code? Resend OTP"}
                  </button>
                </div>
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
                  <Button onClick={handleAddTechSubmit}>Next</Button>
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
            title="Total Technicians"
            value={technicians.length.toString()}
            icon={Users}
            variant="primary"
            trend={{ value: "All registered", isPositive: true }}
          />
          <StatCard
            title="Active"
            value={technicians
              .filter((t: any) => t.status === "Active")
              .length.toString()}
            icon={Users}
            variant="success"
            trend={{ value: "Currently working", isPositive: true }}
          />
          <StatCard
            title="Inactive"
            value={technicians
              .filter((t: any) => t.status !== "Active")
              .length.toString()}
            icon={Users}
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
            placeholder="Search technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchOrgAndTechnicians}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCcw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Technicians table */}
      <div className="bg-card rounded-lg shadow-card p-6">
        <h3 className="text-xl font-semibold mb-4">All Technicians</h3>

        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            Loading technicians...
          </div>
        ) : filteredTechs.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No technicians found.
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
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechs.map((t: any, i: number) => (
                  <tr
                    key={t._id || t.id || i}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{t.name || "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {Array.isArray(t.phone_number)
                          ? `+${t.phone_number.join(" ")}`
                          : "—"}
                      </div>
                    </td>
                    <td className="py-3 px-4">{t.country || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          t.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {t.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t._id || t.id || "")}
                        title="Delete technician"
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
    </div>
  );
};

export default CH_Technicians;
