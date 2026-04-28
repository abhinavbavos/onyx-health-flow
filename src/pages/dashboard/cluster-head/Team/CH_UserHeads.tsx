import { useEffect, useState, useMemo } from "react";
import {
  Search,
  User2,
  RefreshCcw,
  Plus,
  Phone,
  Trash2,
} from "lucide-react";
import { viewOrganization } from "@/services/organization.service";
import {
  createUserHead,
  deleteUserHead,
  verifyUserHead,
} from "@/services/userHead.service";
import { getUserPermissions } from "@/services/permission.service";
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
 * 👥 User Heads Management Page
 * Lists all User Heads under the Cluster Head's organization.
 */
const CH_UserHeads = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userHeads, setUserHeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [permissionsNew, setPermissionsNew] = useState<string[]>([]);
  const [selectedPermissionsNew, setSelectedPermissionsNew] = useState<
    string[]
  >([]);

  // ── Add User Head dialog state ──
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "verify">("form");
  const [addOtp, setAddOtp] = useState("");
  const [pendingUserHeadPhone, setPendingUserHeadPhone] = useState<{
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
    if (resendTimer > 0 || !pendingUserHeadPhone) return;
    try {
      await resendOtp([pendingUserHeadPhone.phone_country, pendingUserHeadPhone.phone_number]);
      setResendTimer(30);
      toast({ title: "OTP Resent" });
    } catch (err: any) {
      toast({ title: "Failed to resend OTP", variant: "destructive" });
    }
  };

  const fetchUserHeads = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) {
        throw new Error("Organization ID missing in localStorage");
      }

      const response = await viewOrganization(orgId);
      const org = response.organization || response;
      const heads = org.userHead || org.userHeads || [];

      setUserHeads(heads);

      const chUserId = org.userId?._id || null;
      if (chUserId) {
        try {
          const perms = await getUserPermissions(chUserId);
          setPermissionsNew(perms);
          setSelectedPermissionsNew([]);
        } catch (e) {
          console.error("Error fetching permissions", e);
        }
      }

      if (heads.length === 0) {
        toast({
          title: "No user heads found",
          description: "This organization has no user heads assigned yet.",
        });
      }
    } catch (err: any) {
      console.error("❌ Error fetching user heads:", err);
      toast({
        title: "Failed to load user heads",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHeads();
  }, []);

  // Filter logic
  const filteredHeads = useMemo(() => {
    if (!searchTerm.trim()) return userHeads;

    return userHeads.filter((u) => {
      const q = searchTerm.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.phone_number?.join("").includes(q) ||
        u.country?.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, userHeads]);

  const handleAddUserHeadSubmit = async () => {
    const { name, phone_country, phone_number, password, country } = addForm;

    if (!name || !phone_number || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    const orgId = localStorage.getItem("organizationId");
    try {
      const payload = {
        name,
        phone_number: [phone_country, phone_number],
        password,
        country,
        orgId,
        permissions: selectedPermissionsNew,
        devices: [],
      };

      await createUserHead(payload);
      setPendingUserHeadPhone({ phone_country, phone_number });
      setAddStep("verify");
      setResendTimer(30);
      toast({ title: "OTP sent to phone number" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not create user head",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyUserHead({ otp: addOtp });
      toast({ title: "User Head verified successfully" });
      setAddDialogOpen(false);
      fetchUserHeads();
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUserHead(id);
      toast({ title: "Deleted successfully" });
      fetchUserHeads();
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">User Heads</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all User Heads under your organization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog
            open={addDialogOpen}
            onOpenChange={(open) => {
              setAddDialogOpen(open);
              if (!open) {
                setAddStep("form");
                setAddOtp("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add User Head
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {addStep === "form" ? "Add User Head" : "Verify OTP"}
                </DialogTitle>
              </DialogHeader>

              {addStep === "form" ? (
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Name"
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
                        setAddForm({ ...addForm, phone_country: e.target.value })
                      }
                      className="w-20"
                    />
                    <Input
                      placeholder="Phone"
                      value={addForm.phone_number}
                      onChange={(e) =>
                        setAddForm({ ...addForm, phone_number: e.target.value })
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
                  {permissionsNew.length > 0 && (
                    <div className="grid gap-2 max-h-40 overflow-y-auto">
                      {permissionsNew.map((p) => (
                        <label key={p} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedPermissionsNew.includes(p)}
                            onCheckedChange={(checked) => {
                              setSelectedPermissionsNew(
                                checked
                                  ? [...selectedPermissionsNew, p]
                                  : selectedPermissionsNew.filter((i) => i !== p)
                              );
                            }}
                          />
                          <span className="text-xs">{p}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm mb-4">
                    Enter OTP sent to +{pendingUserHeadPhone?.phone_country}{" "}
                    {pendingUserHeadPhone?.phone_number}
                  </p>
                  <Input
                    placeholder="OTP"
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
                  <Button onClick={handleAddUserHeadSubmit}>Next</Button>
                ) : (
                  <Button onClick={handleVerifyOtp}>Verify</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchUserHeads}
            title="Refresh"
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total User Heads"
            value={userHeads.length.toString()}
            icon={User2}
            variant="primary"
            trend={{ value: "All active", isPositive: true }}
          />
          <StatCard
            title="Active"
            value={userHeads
              .filter((u) => u.status === "Active")
              .length.toString()}
            icon={User2}
            variant="success"
            trend={{ value: "Currently working", isPositive: true }}
          />
          <StatCard
            title="Inactive"
            value={userHeads
              .filter((u) => u.status !== "Active")
              .length.toString()}
            icon={User2}
            variant="warning"
            trend={{ value: "Need review", isPositive: false }}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">All User Heads</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        ) : filteredHeads.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No user heads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Country</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeads.map((u, i) => (
                  <tr
                    key={u._id || u.id || i}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{u.name || "—"}</td>
                    <td className="py-3 px-4">
                      {u.phone_number && Array.isArray(u.phone_number)
                        ? `+${u.phone_number.join(" ")}`
                        : "—"}
                    </td>
                    <td className="py-3 px-4">{u.country || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {u.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(u._id || u.id)}
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

export default CH_UserHeads;

