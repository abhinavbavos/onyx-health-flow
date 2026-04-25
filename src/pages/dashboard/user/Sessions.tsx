import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { listSessions, Session } from "@/services/session.service";

const Sessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await listSessions();
      setSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to fetch sessions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-muted-foreground mt-1">Manage your health diagnostic sessions</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={fetchSessions} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-6">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No sessions found. Start a new one!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Session ID</th>
                      <th className="py-3 px-4 font-semibold">Profile</th>
                      <th className="py-3 px-4 font-semibold">Product</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{session.id || session._id}</td>
                        <td className="py-3 px-4">{session.profileId?.name || "Unknown"}</td>
                        <td className="py-3 px-4">{session.productId?.name || "Unknown"}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(session.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === "Completed" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {session.status || "Active"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            View Details
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
    </DashboardLayout>
  );
};

export default Sessions;
