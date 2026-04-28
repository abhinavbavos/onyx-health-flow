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
  MapPin,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  userId?: {
    name: string;
    phone_number?: string[];
  };
  userHead?: any[];
  nurse?: any[];
  devices?: any[];
}

const EA_OrganizationView = () => {
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

        // Ensure arrays exist and handle singular/plural variations
        orgData.userHead = orgData.userHead || orgData.userHeads || [];
        orgData.nurse = orgData.nurse || orgData.nurses || [];
        orgData.devices = orgData.devices || [];

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Building2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
        <h2 className="text-xl font-semibold">Organization not found</h2>
        <Button variant="link" onClick={() => navigate(-1)} className="mt-2">
          Return to organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <Building2 className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1a202c]">
                {org.organizationName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {org.organizationCode}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                  org.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {org.status}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1.5 ml-2">
                  <MapPin className="h-4 w-4" />
                  {[org.location?.line1, org.location?.line2, org.location?.line3].filter(Boolean).join(", ")}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl border-primary/20 hover:bg-primary/5 transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Cluster Head & Quick Stats */}
        <div className="xl:col-span-1 space-y-8">
          {/* Cluster Head Card */}
          <Card className="glass-panel overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Responsible Cluster Head
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {org.userId ? (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-primary-foreground flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {org.userId.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#2d3748]">{org.userId.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5" />
                      +{org.userId.phone_number?.join(" ")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No Cluster Head assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="glass-panel border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Organization Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Onboarded On</span>
                <span className="font-semibold">{new Date(org.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Unique Code</span>
                <span className="font-mono font-bold text-primary">{org.organizationCode}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Team & Devices */}
        <div className="xl:col-span-2 space-y-8">
          {/* Team Tabs/Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Heads */}
            <Card className="glass-panel border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-500" /> User Heads
                  </CardTitle>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                    {org.userHead?.length || 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {org.userHead?.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-6 border-2 border-dashed rounded-xl">No user heads found</p>
                  ) : (
                    org.userHead?.map((u: any) => (
                      <div key={u._id} className="p-3 rounded-xl bg-white/50 border border-gray-100 flex items-center justify-between hover:bg-white transition-colors">
                        <div>
                          <p className="font-bold text-[#2d3748]">{u.name}</p>
                          <p className="text-xs text-muted-foreground">+{u.phone_number?.join(" ")}</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Nurses */}
            <Card className="glass-panel border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-rose-500" /> Nurses
                  </CardTitle>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                    {org.nurse?.length || 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {org.nurse?.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-6 border-2 border-dashed rounded-xl">No nurses onboarded</p>
                  ) : (
                    org.nurse?.map((n: any) => (
                      <div key={n._id} className="p-3 rounded-xl bg-white/50 border border-gray-100 flex items-center justify-between hover:bg-white transition-colors">
                        <div>
                          <p className="font-bold text-[#2d3748]">{n.name}</p>
                          <p className="text-xs text-muted-foreground">+{n.phone_number?.join(" ")}</p>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Linked Devices */}
            <Card className="glass-panel border-none shadow-md hover:shadow-lg transition-all duration-300 md:col-span-2">
              <CardHeader className="pb-3 border-b border-gray-100/50 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-amber-500" /> Linked Devices
                  </CardTitle>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                    {org.devices?.length || 0} Assets
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {org.devices?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl bg-gray-50/30">
                    <Monitor className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">No medical devices linked to this organization</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {org.devices?.map((dev: any) => (
                      <div key={dev._id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-amber-200 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                            <Monitor className="h-6 w-6" />
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                            {dev.deviceCode}
                          </span>
                        </div>
                        <p className="font-extrabold text-[#2d3748]">{dev.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">Hardware ID: {dev._id.slice(-6)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EA_OrganizationView;
