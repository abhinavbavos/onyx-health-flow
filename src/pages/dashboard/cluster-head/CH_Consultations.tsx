import { useEffect, useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonTable } from "@/components/dashboard/Skeletons";
import { listSessions } from "@/services/session.service";
import {
  Video,
  Clock,
  User,
  Cpu,
  Stethoscope,
  CheckCircle2,
  Timer,
  XCircle,
} from "lucide-react";

type Row = {
  id?: string;
  patient?: string;
  patientAvatar?: string;
  doctor?: string;
  device?: string;
  status?: string;
  startTime?: string;
  duration?: string;
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  completed: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: CheckCircle2 },
  active:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    icon: Timer },
  pending:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   icon: Clock },
  cancelled: { bg: "bg-slate-100",  text: "text-slate-400",   border: "border-slate-200",   icon: XCircle },
};

const DEFAULT_MOCK: Row[] = [
  { id: "1", patient: "Ananya Rao",    patientAvatar: "AR", doctor: "Dr. Arjun Nair", device: "ECG-01",  status: "completed", startTime: "Jun 12, 10:00 AM", duration: "45 min" },
  { id: "2", patient: "Kiran Shah",    patientAvatar: "KS", doctor: "Dr. Priya Dev",  device: "ECG-02",  status: "active",    startTime: "Jun 12, 11:30 AM", duration: "30 min" },
  { id: "3", patient: "Mohan Lal",     patientAvatar: "ML", doctor: "Dr. Arjun Nair", device: "MONO-01", status: "pending",   startTime: "Jun 12, 02:00 PM", duration: "—" },
  { id: "4", patient: "Savita Patil",  patientAvatar: "SP", doctor: "Dr. Asha Singh",  device: "ECG-03",  status: "completed", startTime: "Jun 11, 09:00 AM", duration: "60 min" },
  { id: "5", patient: "Deepak Verma",  patientAvatar: "DV", doctor: "Dr. Priya Dev",  device: "MONO-02", status: "cancelled", startTime: "Jun 11, 03:30 PM", duration: "—" },
];

const CH_Consultations = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listSessions();
        if (Array.isArray(data) && data.length > 0) {
          setRows(data.map((c: any) => ({
            id: c?._id,
            patient: c?.patient?.name || c?.profile?.name || "Unknown",
            patientAvatar: (c?.patient?.name || c?.profile?.name || "U").charAt(0).toUpperCase(),
            doctor: c?.doctor?.name || "—",
            device: c?.device?.deviceCode || c?.deviceCode || "—",
            status: (c?.status || "pending").toLowerCase(),
            startTime: c?.startTime ? new Date(c.startTime).toLocaleString() : "—",
            duration: c?.duration ? `${c.duration} min` : "—",
          })));
        } else {
          setRows(DEFAULT_MOCK);
        }
      } catch {
        setRows(DEFAULT_MOCK);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Summary counts
  const counts = { completed: 0, active: 0, pending: 0, cancelled: 0 };
  rows.forEach((r) => { if (r.status && counts.hasOwnProperty(r.status)) counts[r.status as keyof typeof counts]++; });

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
          <Video className="h-6 w-6 text-[#F2052C]" /> Consultations
        </h1>
        <p className="text-sm text-slate-400 font-semibold mt-0.5">{rows.length} total sessions across your organization</p>
      </div>

      {/* Status Summary Pills */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-extrabold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              <Icon className="h-3.5 w-3.5" />
              <span className="capitalize">{status}</span>
              <span className="font-black">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
          <SkeletonTable rows={5} />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Video} title="No consultations yet" description="Sessions conducted in your organization will appear here." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const cfg = STATUS_CONFIG[row.status || "pending"];
            const Icon = cfg.icon;
            return (
              <div key={row.id} className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md rounded-[20px] border border-white/60 shadow-sm hover:bg-white/80 transition-all group">
                {/* Patient Avatar */}
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                  {row.patientAvatar}
                </div>

                {/* Patient + Doctor */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#14213D] truncate">{row.patient}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Stethoscope className="h-2.5 w-2.5" /> {row.doctor}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Cpu className="h-2.5 w-2.5" /> {row.device}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-[#14213D] flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3 text-slate-400" /> {row.startTime}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{row.duration}</p>
                </div>

                {/* Status */}
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  <Icon className="h-3 w-3" />
                  {row.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CH_Consultations;
