import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  CheckCircle2,
  LogIn,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Shield,
  AlertTriangle,
  Info,
  User,
  Wifi,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogEntry {
  id: number;
  action: string;
  user: string;
  avatar: string;
  role: string;
  description: string;
  timestamp: string;
  type: "login" | "create" | "edit" | "delete" | "export" | "security";
  severity: "low" | "medium" | "high" | "critical";
}

const LOGS: LogEntry[] = [
  { id: 1,  action: "User Login",           user: "Rohan Mehta",    avatar: "RM", role: "Executive Admin", description: "Signed in from 192.168.1.10 (Chrome, Windows)", timestamp: "Just now",    type: "login",    severity: "low" },
  { id: 2,  action: "Role Permission Edit", user: "super.admin",    avatar: "SA", role: "Super Admin",     description: "Modified Nurse role: disabled 'export' permission", timestamp: "5m ago",  type: "edit",     severity: "medium" },
  { id: 3,  action: "User Created",         user: "Priya Singh",    avatar: "PS", role: "Cluster Head",    description: "New user 'Dr. Ankit Joshi' onboarded as Doctor",   timestamp: "18m ago", type: "create",   severity: "low" },
  { id: 4,  action: "Account Suspended",    user: "super.admin",    avatar: "SA", role: "Super Admin",     description: "Suspended account: aakash@onyx.com (policy violation)", timestamp: "1h ago",type: "security", severity: "high" },
  { id: 5,  action: "Data Export",          user: "Divya Sharma",   avatar: "DS", role: "Cluster Head",    description: "Exported patient analytics report (Jun 2026)",     timestamp: "2h ago",  type: "export",   severity: "medium" },
  { id: 6,  action: "Record Deleted",       user: "Rohan Mehta",    avatar: "RM", role: "Executive Admin", description: "Deleted device 'ECG-UNIT-07' from org ONYX-HYD",   timestamp: "3h ago",  type: "delete",   severity: "high" },
  { id: 7,  action: "User Login",           user: "Dr. Arjun Nair", avatar: "AN", role: "Doctor",          description: "Signed in from 10.0.0.45 (Safari, MacOS)",         timestamp: "4h ago",  type: "login",    severity: "low" },
  { id: 8,  action: "Settings Updated",     user: "super.admin",    avatar: "SA", role: "Super Admin",     description: "Updated system-wide session timeout to 30 minutes", timestamp: "6h ago",  type: "edit",     severity: "medium" },
  { id: 9,  action: "Failed Login",         user: "unknown",        avatar: "?",  role: "Unknown",          description: "3 failed login attempts from 203.145.23.11",       timestamp: "8h ago",  type: "security", severity: "critical" },
  { id: 10, action: "Bulk User Import",     user: "Meera Pillai",   avatar: "MP", role: "User Head",        description: "Imported 12 nurse profiles via CSV upload",         timestamp: "1d ago",  type: "create",   severity: "low" },
];

const TYPE_CONFIG: Record<LogEntry["type"], { icon: any; color: string; bg: string }> = {
  login:    { icon: LogIn,         color: "#35B7C9", bg: "rgba(53,183,201,0.1)" },
  create:   { icon: Plus,          color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  edit:     { icon: Edit,          color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  delete:   { icon: Trash2,        color: "#F2052C", bg: "rgba(242,5,44,0.1)" },
  export:   { icon: Download,      color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  security: { icon: AlertTriangle, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

const SEVERITY_CONFIG: Record<LogEntry["severity"], { label: string; bg: string; text: string; border: string }> = {
  low:      { label: "Low",      bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200" },
  medium:   { label: "Medium",   bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
  high:     { label: "High",     bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100" },
  critical: { label: "Critical", bg: "bg-red-100",    text: "text-red-700",     border: "border-red-200" },
};

const AuditLogs = () => {
  const [logs, setLogs] = useState(LOGS);
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [liveRefresh, setLiveRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = logs.filter((l) => {
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (severityFilter !== "all" && l.severity !== severityFilter) return false;
    return true;
  });

  const simulate = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLogs((prev) => [
        { id: Date.now(), action: "Auto-Refresh Check", user: "system", avatar: "SY", role: "System", description: "Automated health check passed", timestamp: "Just now", type: "login", severity: "low" },
        ...prev.slice(0, 9),
      ]);
      setRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    if (liveRefresh) {
      intervalRef.current = setInterval(simulate, 30000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [liveRefresh]);

  const severityCounts = {
    critical: logs.filter((l) => l.severity === "critical").length,
    high:     logs.filter((l) => l.severity === "high").length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#F2052C]" /> Audit Logs
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">{logs.length} events recorded · last updated just now</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Refresh Toggle */}
          <button
            onClick={() => setLiveRefresh((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold border transition-all ${
              liveRefresh
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${liveRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            {liveRefresh ? "Live" : "Paused"}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={simulate}
            disabled={refreshing}
            className="h-9 rounded-[14px] border border-slate-200 bg-white/60"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-[#14213D] to-[#1e3a5f] text-white rounded-[14px] border-none shadow-md h-9">
            <Download className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {severityCounts.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-bold text-red-700 flex-1">
            <strong>{severityCounts.critical} critical</strong> and <strong>{severityCounts.high} high-severity</strong> events detected. Review immediately.
          </p>
          <button className="text-xs font-extrabold text-red-600 hover:opacity-70 underline shrink-0">View Critical</button>
        </div>
      )}

      {/* Filters + Summary */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Filter className="h-3.5 w-3.5" /> Filters:
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm font-semibold">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="export">Export</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[150px] rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm font-semibold">
            <SelectValue placeholder="All Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-400 font-semibold ml-auto">{filtered.length} of {logs.length} events</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent z-0" />

        <div className="space-y-4 relative">
          {filtered.map((log, idx) => {
            const tc = TYPE_CONFIG[log.type];
            const sc = SEVERITY_CONFIG[log.severity];
            const Icon = tc.icon;
            const isFirst = idx === 0;
            return (
              <div key={log.id} className="flex gap-4">
                {/* Timeline Node */}
                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white"
                  style={{ background: tc.bg, color: tc.color }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ height: "1.125rem", width: "1.125rem" }} />
                </div>

                {/* Log Card */}
                <div className={`flex-1 p-4 rounded-[20px] border bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all ${isFirst ? "ring-1 ring-[#F2052C]/20" : ""}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-extrabold text-[#14213D]">{log.action}</p>
                      {isFirst && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F2052C] text-white uppercase tracking-wider">NEW</span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${sc.bg} ${sc.text} ${sc.border}`}>
                        {sc.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold shrink-0 uppercase tracking-wider">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mb-3 leading-relaxed">{log.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white text-[9px] font-extrabold shrink-0">
                      {log.avatar}
                    </div>
                    <span className="text-xs font-bold text-[#14213D]">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-100 rounded-full">{log.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
