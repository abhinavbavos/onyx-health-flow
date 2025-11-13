import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import { viewOrganization } from "@/services/organization.service";
import { Users, User2, HeartPulse } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CH_TeamIndex = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ userHeads: 0, nurses: 0 });
  const [userHeads, setUserHeads] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem("organizationId");
      const data = await viewOrganization(orgId!);
      const org = data.organization || data;

      setStats({
        userHeads: org.userHead?.length || 0,
        nurses: org.nurse?.length || 0,
      });
      setUserHeads(org.userHead || []);
      setNurses(org.nurse || []);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error fetching team data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Loading team overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Overview</h1>
        <p className="text-muted-foreground mt-1">
          Quick view of your organization’s team members
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="User Heads"
          value={stats.userHeads.toString()}
          icon={User2}
          variant="primary"
          trend={{ value: "Active", isPositive: true }}
        />
        <StatCard
          title="Nurses"
          value={stats.nurses.toString()}
          icon={HeartPulse}
          variant="secondary"
          trend={{ value: "Active", isPositive: true }}
        />
      </div>

      {/* User Heads Table */}
      <div className="bg-card rounded-lg shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">User Heads</h3>
          <button
            onClick={() => navigate("/dashboard/cluster-head/team/user-heads")}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Phone</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {userHeads.slice(0, 3).map((u, i) => (
              <tr
                key={i}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{u.name}</td>
                <td className="py-3 px-4">+{u.phone_number?.join(" ")}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
            {userHeads.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-muted-foreground py-4"
                >
                  No user heads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Nurses Table */}
      <div className="bg-card rounded-lg shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Nurses</h3>
          <button
            onClick={() => navigate("/dashboard/cluster-head/team/nurses")}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Phone</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {nurses.slice(0, 3).map((n, i) => (
              <tr
                key={i}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{n.name}</td>
                <td className="py-3 px-4">+{n.phone_number?.join(" ")}</td>
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
              </tr>
            ))}
            {nurses.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-muted-foreground py-4"
                >
                  No nurses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CH_TeamIndex;
