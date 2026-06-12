import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import { SkeletonTable } from "@/components/dashboard/Skeletons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  joined: string;
  phone: string;
  avatar: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: "Rohan Mehta",    email: "rohan@onyx.com",    role: "Executive Admin", roleColor: "#14213D", status: "Active",   lastLogin: "2 min ago",  joined: "Jan 15, 2026", phone: "+91 98765 43210", avatar: "RM" },
  { id: 2, name: "Priya Singh",    email: "priya@onyx.com",    role: "Cluster Head",    roleColor: "#35B7C9", status: "Active",   lastLogin: "1h ago",     joined: "Feb 3, 2026",  phone: "+91 87654 32109", avatar: "PS" },
  { id: 3, name: "Dr. Arjun Nair", email: "arjun@onyx.com",   role: "Doctor",          roleColor: "#F59E0B", status: "Active",   lastLogin: "3h ago",     joined: "Mar 10, 2026", phone: "+91 76543 21098", avatar: "AN" },
  { id: 4, name: "Sunita Devi",    email: "sunita@onyx.com",   role: "Nurse",           roleColor: "#10B981", status: "Active",   lastLogin: "Yesterday",  joined: "Mar 22, 2026", phone: "+91 65432 10987", avatar: "SD" },
  { id: 5, name: "Ravi Kumar",     email: "ravi@onyx.com",     role: "Technician",      roleColor: "#EC4899", status: "Inactive", lastLogin: "3 days ago", joined: "Apr 5, 2026",  phone: "+91 54321 09876", avatar: "RK" },
  { id: 6, name: "Meera Pillai",   email: "meera@onyx.com",    role: "User Head",       roleColor: "#8B5CF6", status: "Active",   lastLogin: "5h ago",     joined: "Apr 18, 2026", phone: "+91 43210 98765", avatar: "MP" },
  { id: 7, name: "Aakash Patel",   email: "aakash@onyx.com",   role: "Nurse",           roleColor: "#10B981", status: "Suspended",lastLogin: "1 week ago", joined: "May 1, 2026",  phone: "+91 32109 87654", avatar: "AP" },
  { id: 8, name: "Divya Sharma",   email: "divya@onyx.com",    role: "Cluster Head",    roleColor: "#35B7C9", status: "Active",   lastLogin: "10m ago",    joined: "May 20, 2026", phone: "+91 21098 76543", avatar: "DS" },
];

const STATUS_CONFIG = {
  Active:    { icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500" },
  Inactive:  { icon: Clock,        bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200",  dot: "bg-slate-400" },
  Suspended: { icon: XCircle,      bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100",   dot: "bg-rose-500" },
};

const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filtered, setFiltered] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let result = users;
    if (search) result = result.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") result = result.filter((u) => u.status === statusFilter);
    setFiltered(result);
  }, [search, roleFilter, statusFilter, users]);

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)
    );
    if (selected?.id === id) setSelected((s) => s ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : null);
  };

  const uniqueRoles = [...new Set(MOCK_USERS.map((u) => u.role))];

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#F2052C]" /> User Management
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">
            {users.filter((u) => u.status === "Active").length} active of {users.length} total users
          </p>
        </div>
        {/* User Growth Pill */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-extrabold text-emerald-600">+12% this month</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-[14px] border-slate-200 h-9 bg-white/60 backdrop-blur-sm text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm font-semibold">
            <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] rounded-[14px] border-slate-200 h-9 bg-white/60 text-sm font-semibold">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
          {["User", "Role", "Status", "Last Login", "Joined", "Actions"].map((h, i) => (
            <div key={h} className={`text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 ${i === 0 ? "col-span-3" : i === 5 ? "col-span-2 justify-end" : "col-span-2"}`}>
              {h} {i < 4 && <ChevronDown className="h-3 w-3" />}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="p-6"><SkeletonTable rows={5} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filters." />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((user) => {
              const sc = STATUS_CONFIG[user.status];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelected(user)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/60 transition-colors cursor-pointer group"
                >
                  {/* User */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#14213D] truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{user.email}</p>
                    </div>
                  </div>
                  {/* Role */}
                  <div className="col-span-2 flex items-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold border" style={{ background: `${user.roleColor}10`, color: user.roleColor, borderColor: `${user.roleColor}20` }}>
                      {user.role}
                    </span>
                  </div>
                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${sc.bg} ${sc.text} ${sc.border}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} ${user.status === "Active" ? "animate-pulse" : ""}`} />
                      {user.status}
                    </span>
                  </div>
                  {/* Last Login */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-xs text-slate-500 font-semibold">{user.lastLogin}</span>
                  </div>
                  {/* Joined */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-xs text-slate-400 font-semibold">{user.joined.split(",")[0]}</span>
                  </div>
                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(user.id)}
                      className={`h-7 px-3 rounded-[10px] text-[10px] font-extrabold uppercase tracking-wider ${
                        user.status === "Active"
                          ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Detail Slide-over */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-[420px] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
          {selected && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                    {selected.avatar}
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-extrabold text-[#14213D]">{selected.name}</SheetTitle>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold" style={{ background: `${selected.roleColor}10`, color: selected.roleColor }}>
                      {selected.role}
                    </span>
                  </div>
                </div>
              </SheetHeader>

              {/* Info Cards */}
              <div className="space-y-3">
                {[
                  { icon: Mail,     label: "Email",      value: selected.email },
                  { icon: Phone,    label: "Phone",      value: selected.phone },
                  { icon: Calendar, label: "Joined",     value: selected.joined },
                  { icon: Clock,    label: "Last Login", value: selected.lastLogin },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-[14px]">
                    <div className="h-8 w-8 rounded-[10px] bg-white flex items-center justify-center shrink-0 border border-slate-100">
                      <item.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-[#14213D]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Card */}
              <div className={`p-4 rounded-[16px] border flex items-center gap-3 ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].border}`}>
                <Shield className={`h-5 w-5 ${STATUS_CONFIG[selected.status].text}`} />
                <div className="flex-1">
                  <p className="text-xs font-extrabold text-[#14213D]">Account Status</p>
                  <p className={`text-sm font-extrabold ${STATUS_CONFIG[selected.status].text}`}>{selected.status}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleToggleStatus(selected.id)}
                  className={`rounded-[12px] h-8 text-xs font-bold ${
                    selected.status === "Active"
                      ? "bg-rose-100 text-rose-600 hover:bg-rose-200 border-rose-200"
                      : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-emerald-200"
                  } border`}
                >
                  {selected.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserManagement;
