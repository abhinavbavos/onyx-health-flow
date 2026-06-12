import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  UserPlus,
  Edit,
  Trash2,
  Check,
  X,
  ChevronRight,
  Users,
  Lock,
} from "lucide-react";

const ROLES = [
  {
    id: 1,
    name: "Super Admin",
    users: 2,
    color: "#F2052C",
    description: "Full platform control",
    permissions: { view: true, create: true, edit: true, delete: true, export: true, manage: true },
  },
  {
    id: 2,
    name: "Executive Admin",
    users: 5,
    color: "#14213D",
    description: "Organization management",
    permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true },
  },
  {
    id: 3,
    name: "Cluster Head",
    users: 12,
    color: "#35B7C9",
    description: "Regional & financial management",
    permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: false },
  },
  {
    id: 4,
    name: "User Head",
    users: 8,
    color: "#8B5CF6",
    description: "Nurse & device management",
    permissions: { view: true, create: true, edit: true, delete: false, export: false, manage: false },
  },
  {
    id: 5,
    name: "Nurse",
    users: 45,
    color: "#10B981",
    description: "Device & report management",
    permissions: { view: true, create: false, edit: false, delete: false, export: false, manage: false },
  },
  {
    id: 6,
    name: "Doctor",
    users: 23,
    color: "#F59E0B",
    description: "Consultation & prescriptions",
    permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: false },
  },
  {
    id: 7,
    name: "Technician",
    users: 15,
    color: "#EC4899",
    description: "Device diagnostics & service logs",
    permissions: { view: true, create: false, edit: true, delete: false, export: false, manage: false },
  },
];

const PERMISSIONS = ["view", "create", "edit", "delete", "export", "manage"] as const;
type PermKey = typeof PERMISSIONS[number];

const PERMISSION_LABELS: Record<PermKey, string> = {
  view: "View Data",
  create: "Create Records",
  edit: "Edit Records",
  delete: "Delete Records",
  export: "Export Data",
  manage: "Manage Users",
};

const RoleManagement = () => {
  const [roles, setRoles] = useState(ROLES);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "", color: "#F2052C" });

  const handleTogglePerm = (roleId: number, perm: PermKey) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? { ...r, permissions: { ...r.permissions, [perm]: !r.permissions[perm] } }
          : r
      )
    );
    if (selectedRole.id === roleId) {
      setSelectedRole((sr) => ({
        ...sr,
        permissions: { ...sr.permissions, [perm]: !sr.permissions[perm] },
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#F2052C]" /> Role Management
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">{roles.length} roles · manage permissions across the platform</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white rounded-[14px] border-none shadow-md shadow-[#F2052C]/20 hover:opacity-90 h-9"
        >
          <UserPlus className="h-4 w-4 mr-1.5" /> Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Role List */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">Active Roles</p>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left p-4 rounded-[20px] border transition-all hover-lift ${
                selectedRole.id === role.id
                  ? "bg-white/80 border-[#F2052C]/20 shadow-md"
                  : "bg-white/40 border-white/50 hover:bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-[14px] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm"
                  style={{ background: role.color }}
                >
                  {role.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#14213D] truncate">{role.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{role.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Users className="h-3 w-3 text-slate-400" />
                    <span className="text-xs font-extrabold" style={{ color: role.color }}>{role.users}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 ml-auto mt-1 transition-colors ${selectedRole.id === role.id ? "text-[#F2052C]" : "text-slate-300"}`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permission Matrix */}
        <div className="xl:col-span-2 bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-[14px] flex items-center justify-center text-white font-extrabold shadow-sm"
                style={{ background: selectedRole.color }}
              >
                {selectedRole.name[0]}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#14213D]">{selectedRole.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{selectedRole.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded-[10px] bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Edit className="h-3.5 w-3.5 text-slate-500" />
              </button>
              <button className="h-8 w-8 rounded-[10px] bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-colors">
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              </button>
            </div>
          </div>

          {/* Permission Grid */}
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Permission Matrix</p>
          <div className="space-y-2">
            {PERMISSIONS.map((perm) => {
              const hasPermission = selectedRole.permissions[perm];
              return (
                <div
                  key={perm}
                  className={`flex items-center justify-between p-4 rounded-[16px] transition-all ${
                    hasPermission ? "bg-emerald-50/60 border border-emerald-100" : "bg-slate-50/60 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 ${hasPermission ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                      {hasPermission ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#14213D]">{PERMISSION_LABELS[perm]}</p>
                      <p className="text-[10px] text-slate-400 font-semibold capitalize">{perm} access</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePerm(selectedRole.id, perm)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 focus:outline-none ${
                      hasPermission ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                        hasPermission ? "left-5.5 translate-x-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Role Hierarchy Visual */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Role Hierarchy</p>
            <div className="flex items-center gap-2 flex-wrap">
              {roles.map((r, i) => (
                <div key={r.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                      selectedRole.id === r.id
                        ? "text-white shadow-sm border-transparent"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                    style={selectedRole.id === r.id ? { background: r.color, borderColor: r.color } : {}}
                  >
                    {r.name}
                  </button>
                  {i < roles.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#14213D] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#F2052C]" /> Create New Role
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Role Name</Label>
              <Input
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g. Regional Manager"
                className="rounded-[14px] border-slate-200 h-10"
              />
            </div>
            <div>
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</Label>
              <Input
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Brief role description"
                className="rounded-[14px] border-slate-200 h-10"
              />
            </div>
            <div>
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={newRole.color} onChange={(e) => setNewRole({ ...newRole, color: e.target.value })} className="h-10 w-16 rounded-[10px] border border-slate-200 cursor-pointer" />
                <span className="text-sm font-bold text-slate-500">{newRole.color}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)} className="flex-1 rounded-[14px] h-10 font-bold border-slate-200">Cancel</Button>
              <Button
                onClick={() => {
                  if (!newRole.name) return;
                  setRoles((prev) => [
                    ...prev,
                    { id: Date.now(), name: newRole.name, users: 0, color: newRole.color, description: newRole.description, permissions: { view: true, create: false, edit: false, delete: false, export: false, manage: false } },
                  ]);
                  setCreateOpen(false);
                  setNewRole({ name: "", description: "", color: "#F2052C" });
                }}
                disabled={!newRole.name}
                className="flex-1 rounded-[14px] h-10 font-bold bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white border-none shadow-md"
              >
                Create Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
