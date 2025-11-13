import { useEffect, useState, useMemo } from "react";
import { Search, User2, RefreshCcw } from "lucide-react";
import { viewOrganization } from "@/services/organization.service";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";

/**
 * 👥 User Heads Management Page
 * Lists all User Heads under the Cluster Head's organization.
 */
const CH_UserHeads = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userHeads, setUserHeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUserHeads = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) {
        throw new Error("Organization ID missing in localStorage");
      }

      console.log("🔍 Fetching organization data for:", orgId);

      const response = await viewOrganization(orgId);
      console.log("✅ Organization response:", response);

      // Handle different response structures
      const org = response.organization || response;
      const heads = org.userHead || org.userHeads || [];

      console.log("👥 User heads found:", heads);
      setUserHeads(heads);

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 pl-10"
            />
          </div>
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
        <h3 className="text-xl font-semibold mb-4">All User Heads</h3>

        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            <RefreshCcw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            Loading user heads...
          </div>
        ) : filteredHeads.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            {searchTerm
              ? "No user heads match your search."
              : "No user heads found."}
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
                  <th className="text-left py-3 px-4 font-semibold">
                    Date Created
                  </th>
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
                      {u.date_created || u.createdAt
                        ? new Date(
                            u.date_created || u.createdAt
                          ).toLocaleDateString()
                        : "—"}
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
