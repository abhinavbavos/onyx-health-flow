import { useEffect, useState, useMemo } from "react";
import { Search, HeartPulse, RefreshCcw } from "lucide-react";
import { viewOrganization } from "@/services/organization.service";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";

/**
 * 💉 Nurses Management Page
 * Lists all nurses under the Cluster Head's organization.
 */
const CH_Nurses = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [nurses, setNurses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");

      const data = await viewOrganization(orgId);
      const org = data.organization || data;

      setNurses(org.nurse || []);
    } catch (err: any) {
      console.error("❌ Error fetching nurses:", err);
      toast({
        title: "Failed to load nurses",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, []);

  // Filter logic
  const filteredNurses = useMemo(() => {
    return nurses.filter((n) => {
      const q = searchTerm.toLowerCase();
      return (
        n.name?.toLowerCase().includes(q) ||
        n.phone_number?.join("").includes(q) ||
        n.country?.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, nurses]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Nurses</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all nurses under your organization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-56"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={fetchNurses}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary */}
      {!loading && (
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
            value={nurses.filter((n) => n.status === "Active").length.toString()}
            icon={HeartPulse}
            variant="success"
            trend={{ value: "Currently working", isPositive: true }}
          />
          <StatCard
            title="Inactive"
            value={nurses.filter((n) => n.status !== "Active").length.toString()}
            icon={HeartPulse}
            variant="warning"
            trend={{ value: "Need verification", isPositive: false }}
          />
        </div>
      )}

      {/* Table */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Country</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((n, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{n.name}</td>
                    <td className="py-3 px-4">
                      {n.phone_number ? `+${n.phone_number.join(" ")}` : "—"}
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
                        {n.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {n.date_created
                        ? new Date(n.date_created).toLocaleString()
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

export default CH_Nurses;
