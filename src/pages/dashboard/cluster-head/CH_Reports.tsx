import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonTable } from "@/components/dashboard/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listReportsByOrganization } from "@/services/report.service";
import {
  FileText,
  Search,
  Download,
  Calendar,
  Cpu,
  User,
  RefreshCw,
} from "lucide-react";

type Row = {
  id?: string;
  reportCode?: string;
  profile?: string;
  profileAvatar?: string;
  device?: string;
  uploadedBy?: string;
  createdAt?: string;
  s3Link?: string;
};

const CH_Reports = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      if (!orgId) throw new Error("Organization ID missing");
      const data = await listReportsByOrganization(orgId);
      const mapped = (data?.reports || data || []).map((r: any) => ({
        id: r?._id,
        reportCode: r?.reportCode,
        profile: r?.profile?.name || r?.patientName || "Unknown Patient",
        profileAvatar: (r?.profile?.name || "U").charAt(0).toUpperCase(),
        device: r?.product?.deviceCode || r?.deviceCode || "—",
        uploadedBy: r?.uploadedBy?.name || r?.uploadedByName || "—",
        createdAt: r?.createdAt ? new Date(r.createdAt).toLocaleString() : "—",
        s3Link: r?.s3Link,
      }));
      setRows(mapped);
    } catch (err) {
      console.error("Failed to load organization reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (r.reportCode || "").toLowerCase().includes(s) ||
      (r.profile || "").toLowerCase().includes(s) ||
      (r.device || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#F2052C]" /> Reports
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">
            {rows.length} health reports generated in your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading} className="h-9 rounded-[14px] border border-slate-200 bg-white/60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by patient, code, device..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm"
        />
      </div>

      {/* Report Cards */}
      {loading ? (
        <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
          <SkeletonTable rows={5} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No reports found" description="Reports generated in your organization will appear here." />
      ) : (
        <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
            {[
              { label: "Patient",      span: "col-span-3" },
              { label: "Report Code",  span: "col-span-2" },
              { label: "Device",       span: "col-span-2" },
              { label: "Uploaded By",  span: "col-span-2" },
              { label: "Date",         span: "col-span-2" },
              { label: "Action",       span: "col-span-1 text-right" },
            ].map((h) => (
              <div key={h.label} className={`text-[10px] font-extrabold text-slate-400 uppercase tracking-wider ${h.span}`}>
                {h.label}
              </div>
            ))}
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/70 transition-colors group">
                {/* Patient */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                    {r.profileAvatar}
                  </div>
                  <p className="text-sm font-bold text-[#14213D] truncate">{r.profile}</p>
                </div>
                {/* Report Code */}
                <div className="col-span-2 flex items-center">
                  <span className="text-xs font-extrabold text-[#F2052C] bg-[#F2052C]/8 px-2.5 py-1 rounded-full">{r.reportCode || "—"}</span>
                </div>
                {/* Device */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500 truncate">{r.device}</span>
                </div>
                {/* Uploaded By */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-500 truncate">{r.uploadedBy}</span>
                </div>
                {/* Date */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400 font-semibold">{r.createdAt}</span>
                </div>
                {/* Action */}
                <div className="col-span-1 flex items-center justify-end">
                  {r.s3Link ? (
                    <a href={r.s3Link} target="_blank" rel="noreferrer">
                      <button className="h-8 w-8 rounded-[10px] bg-[#35B7C9]/10 flex items-center justify-center text-[#35B7C9] hover:bg-[#35B7C9]/20 transition-colors">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold">N/A</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CH_Reports;
