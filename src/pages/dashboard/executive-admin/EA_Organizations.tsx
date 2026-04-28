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
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Edit,
  MapPin,
  Building2,
  Trash2,
  Eye,
} from "lucide-react";
import {
  listOrganizations,
  createOrganization,
  deleteOrganization,
  viewOrganization,
} from "@/services/organization.service";
import { useNavigate } from "react-router-dom"; // ✅ import navigation

const EA_Organizations = () => {
  const { toast } = useToast();
  const navigate = useNavigate(); // ✅ initialize navigation hook
  const [orgs, setOrgs] = useState<any[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", location: "" });

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      try {
        const data = await listOrganizations();
        const orgList = data.organizations || data;
        setOrgs(orgList);
        setFilteredOrgs(orgList);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching organizations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, [toast]);

  useEffect(() => {
    if (search.trim() === "") setFilteredOrgs(orgs);
    else {
      setFilteredOrgs(
        orgs.filter((org) =>
          org.organizationName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, orgs]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.location) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      if (editMode) {
        toast({ title: "Edit functionality not yet implemented" });
      } else {
        const newOrg = await createOrganization(formData);
        setOrgs((prev) => [...prev, newOrg]);
        toast({ title: "Organization created successfully" });
      }

      setDialogOpen(false);
      setFormData({ id: "", name: "", location: "" });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save organization", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      await deleteOrganization(id);
      setOrgs((prev) => prev.filter((o) => o.id !== id));
      toast({ title: "Organization deleted" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" /> Organizations
          </h1>
          <p className="text-muted-foreground mt-1">
            View healthcare organizations connected to your network
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading organizations...
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No organizations found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Cluster Head</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td
                        className="py-3 px-4 font-medium"
                        onClick={() =>
                          navigate(
                            `/dashboard/executive-admin/organizations/${org.id}`
                          )
                        }
                      >
                        {org.organizationName}
                      </td>
                      <td
                        className="py-3 px-4 text-muted-foreground"
                        onClick={() =>
                          navigate(
                            `/dashboard/executive-admin/organizations/${org.id}`
                          )
                        }
                      >
                        {org.userId?.name || "N/A"}
                      </td>
                      <td
                        className="py-3 px-4 text-muted-foreground"
                        onClick={() =>
                          navigate(
                            `/dashboard/executive-admin/organizations/${org.id}`
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{`${org.location?.line1 || ""}, ${org.location?.line2 || ""}`}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/dashboard/executive-admin/organizations/${org.id}`
                              );
                            }}
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </div>
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

export default EA_Organizations;
