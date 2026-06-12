import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  UserPlus,
  Cpu,
  FileText,
  Phone,
  Clock,
  CheckCircle2,
  Coffee,
  Moon,
  Sun,
} from "lucide-react";

interface Nurse {
  id: number;
  name: string;
  avatar: string;
  shift: "Morning" | "Afternoon" | "Night";
  devices: number;
  reports: number;
  status: "Active" | "On Break" | "Off Duty";
  phone: string;
  lastActive: string;
}

const NURSES: Nurse[] = [
  { id: 1, name: "Sarah Johnson",  avatar: "SJ", shift: "Morning",   devices: 5,  reports: 12, status: "Active",   phone: "+91 98765 43210", lastActive: "2m ago" },
  { id: 2, name: "Michael Chen",   avatar: "MC", shift: "Afternoon",  devices: 4,  reports: 9,  status: "Active",   phone: "+91 87654 32109", lastActive: "15m ago" },
  { id: 3, name: "Emma Williams",  avatar: "EW", shift: "Night",      devices: 6,  reports: 15, status: "Active",   phone: "+91 76543 21098", lastActive: "1h ago" },
  { id: 4, name: "James Brown",    avatar: "JB", shift: "Morning",    devices: 3,  reports: 7,  status: "On Break", phone: "+91 65432 10987", lastActive: "30m ago" },
  { id: 5, name: "Pooja Sharma",   avatar: "PS", shift: "Afternoon",  devices: 5,  reports: 11, status: "Active",   phone: "+91 54321 09876", lastActive: "5m ago" },
  { id: 6, name: "Ravi Patel",     avatar: "RP", shift: "Night",      devices: 4,  reports: 8,  status: "Off Duty", phone: "+91 43210 98765", lastActive: "8h ago" },
];

const SHIFT_ICON = {
  Morning:   { icon: Sun,    color: "#F59E0B", bg: "bg-amber-50" },
  Afternoon: { icon: Coffee, color: "#F2052C", bg: "bg-rose-50" },
  Night:     { icon: Moon,   color: "#8B5CF6", bg: "bg-violet-50" },
};

const STATUS_CONFIG = {
  Active:    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500 animate-pulse" },
  "On Break":{ bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   dot: "bg-amber-500" },
  "Off Duty":{ bg: "bg-slate-100",  text: "text-slate-400",   border: "border-slate-200",   dot: "bg-slate-400" },
};

const Nurses = () => {
  const [search, setSearch] = useState("");

  const filtered = NURSES.filter((n) => {
    if (!search) return true;
    return n.name.toLowerCase().includes(search.toLowerCase()) || n.shift.toLowerCase().includes(search.toLowerCase());
  });

  const activeCount = NURSES.filter((n) => n.status === "Active").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#F2052C]" /> Nurses
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">{activeCount} on duty · {NURSES.length} total</p>
        </div>
        <Button className="bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white rounded-[14px] border-none shadow-md shadow-[#F2052C]/20 hover:opacity-90 h-9">
          <UserPlus className="h-4 w-4 mr-1.5" /> Add Nurse
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or shift..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm"
        />
      </div>

      {/* Nurse Cards */}
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No nurses found" description="Add nurses to your organization to see them here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((nurse) => {
            const sc = STATUS_CONFIG[nurse.status];
            const shiftCfg = SHIFT_ICON[nurse.shift];
            const ShiftIcon = shiftCfg.icon;
            return (
              <div key={nurse.id} className="hover-lift bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-base shadow-md shrink-0">
                      {nurse.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#14213D]">{nurse.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`h-5 w-5 rounded-full ${shiftCfg.bg} flex items-center justify-center`}>
                          <ShiftIcon className="h-3 w-3" style={{ color: shiftCfg.color }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{nurse.shift} Shift</span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${sc.bg} ${sc.text} ${sc.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                    {nurse.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50/60 rounded-[14px] p-3 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#35B7C9] shrink-0" />
                    <div>
                      <p className="text-lg font-extrabold text-[#14213D] leading-tight">{nurse.devices}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Devices</p>
                    </div>
                  </div>
                  <div className="bg-slate-50/60 rounded-[14px] p-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#F2052C] shrink-0" />
                    <div>
                      <p className="text-lg font-extrabold text-[#14213D] leading-tight">{nurse.reports}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Reports</p>
                    </div>
                  </div>
                </div>

                {/* Contact + Last Active */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {nurse.phone}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                      <Clock className="h-3 w-3" /> Last active {nurse.lastActive}
                    </div>
                    {nurse.status === "Active" && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> On Duty
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Nurses;
