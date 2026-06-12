import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Cpu,
  User,
  Activity,
} from "lucide-react";
import { listOrganizations } from "@/services/organization.service";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/dashboard/PageHeader";

const EA_Organizations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      try {
        const data = await listOrganizations();
        const orgList = data.organizations || data;
        const normalized = (orgList || []).map((org: any) => ({
          ...org,
          id: org._id || org.id,
        }));
        setOrgs(normalized);
        setFilteredOrgs(normalized);
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
          org.organizationName?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, orgs]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader />

      {/* Header and Actions Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-[#14213D]">
            <Building2 className="h-7 w-7 text-primary" /> Organizations
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Manage healthcare facilities, cluster heads and connected hardware
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-[14px] border-slate-200 bg-white/60 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-none bg-white/60 backdrop-blur-md rounded-[24px] shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-[16px] bg-slate-100 skeleton-block" />
                <div className="h-5 w-16 rounded-full bg-slate-100 skeleton-block" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-100 skeleton-block" />
                <div className="h-3 w-1/2 rounded bg-slate-100 skeleton-block" />
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="space-y-2">
                <div className="h-3 w-2/3 rounded bg-slate-100 skeleton-block" />
                <div className="h-3 w-1/2 rounded bg-slate-100 skeleton-block" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredOrgs.length === 0 ? (
        <Card className="border-none bg-white/60 backdrop-blur-md rounded-[24px] shadow-sm p-12 text-center">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-base">No organizations found</p>
          <p className="text-xs text-slate-400 mt-1">Try refining your search keyword.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const firstLetter = org.organizationName?.[0] || "O";
            const isActive = org.status === "Active";
            return (
              <Card
                key={org.id}
                onClick={() => navigate(`/dashboard/executive-admin/organizations/${org.id}`)}
                className="group hover-lift border-none bg-white/60 backdrop-blur-md rounded-[24px] shadow-sm p-6 cursor-pointer relative overflow-hidden transition-all duration-300 hover:bg-white"
              >
                {/* Accent Blob */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.03] blur-xl group-hover:scale-125 transition-all duration-500" style={{ background: isActive ? "#10B981" : "#F2052C" }} />
                
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-[16px] bg-gradient-to-br from-[#14213D] to-[#1e3a5f] text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                    {firstLetter}
                  </div>
                  
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-500 border-rose-100"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-400"}`} />
                    {org.status || "Active"}
                  </span>
                </div>

                {/* Facility Info */}
                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-[#14213D] group-hover:text-primary transition-colors leading-tight mb-1 truncate">
                    {org.organizationName}
                  </h3>
                  <p className="text-[10px] font-extrabold text-[#35B7C9] uppercase tracking-widest leading-none">
                    {org.organizationCode || "ORG-CODE"}
                  </p>
                </div>

                <div className="h-px bg-slate-100 my-4" />

                {/* Details Section */}
                <div className="space-y-3 text-xs text-slate-500 font-semibold mb-4">
                  {/* Cluster Head */}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Cluster Head: <strong className="text-[#14213D]">{org.userId?.name || "None Assigned"}</strong>
                    </span>
                  </div>

                  {/* Location */}
                  {org.location && (org.location.line1 || org.location.line2) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {org.location.line1 || ""}{org.location.line2 ? `, ${org.location.line2}` : ""}
                      </span>
                    </div>
                  )}

                  {/* Devices Count */}
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>
                      Devices connected: <strong className="text-[#35B7C9]">{org.devices?.length || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Footer Link Overlay Trigger */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100/50 mt-2">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider group-hover:text-primary transition-colors">
                    View facility setup
                  </span>
                  <div className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EA_Organizations;
