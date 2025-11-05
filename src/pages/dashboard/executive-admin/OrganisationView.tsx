import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  User,
  Stethoscope,
  HeartPulse,
  Wrench,
  ArrowLeft,
  Phone,
  Shield,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { viewOrganization } from "@/services/organization.service";

interface Organization {
  _id: string;
  organizationName: string;
  organizationCode: string;
  location: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
  status: string;
  createdAt: string;
  clusterHead?: {
    name: string;
    phone_number?: string[];
  };
  doctors?: any[];
  userHeads?: any[];
  nurses?: any[];
  technicians?: any[];
}

const OrganizationView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // =============================
  // Fetch Organization by ID
  // =============================
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await viewOrganization(id!);
        const orgData = data.organization || data;

        // Ensure arrays exist
        orgData.doctors = orgData.doctors || [];
        orgData.userHeads = orgData.userHeads || [];
        orgData.nurses = orgData.nurses || [];
        orgData.technicians = orgData.technicians || [];

        setOrg(orgData);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching organization details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading organization details...
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Organization not found
      </div>
    );
  }

  // =============================
  // Render UI
  // =============================
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            {org.organizationName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Code: <span className="font-medium">{org.organizationCode}</span> |{" "}
            Status: <span className="font-medium">{org.status}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {[org.location?.line1, org.location?.line2, org.location?.line3]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Created at: {new Date(org.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      <Separator />

      {/* Cluster Head Info */}
      {org.clusterHead && (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Cluster Head
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{org.clusterHead.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  +{org.clusterHead.phone_number?.join(" ")}
                </p>
              </div>
              <Button variant="secondary" size="sm">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" /> Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {org.doctors?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No doctors added yet</p>
            ) : (
              <ul className="space-y-2">
                {org.doctors.map((d) => (
                  <li key={d._id} className="border p-3 rounded-md">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {d.specialty || "—"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* User Heads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> User Heads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {org.userHeads?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No user heads available</p>
            ) : (
              <ul className="space-y-2">
                {org.userHeads.map((u) => (
                  <li key={u._id} className="border p-3 rounded-md">
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      +{u.phone_number?.join(" ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Nurses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" /> Nurses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {org.nurses?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No nurses available</p>
            ) : (
              <ul className="space-y-2">
                {org.nurses.map((n) => (
                  <li key={n._id} className="border p-3 rounded-md">
                    <p className="font-semibold">{n.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" /> +{n.phone_number?.join(" ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Technicians */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" /> Technicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            {org.technicians?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No technicians available</p>
            ) : (
              <ul className="space-y-2">
                {org.technicians.map((t) => (
                  <li key={t._id} className="border p-3 rounded-md">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-4 w-4" /> +{t.phone_number?.join(" ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationView;
