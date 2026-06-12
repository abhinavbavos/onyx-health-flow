import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
  CheckCircle2,
  Timer,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Confirmed:  { bg: "bg-blue-50",    text: "text-blue-600",   border: "border-blue-100",   dot: "bg-blue-500" },
  Urgent:     { bg: "bg-rose-50",    text: "text-rose-600",   border: "border-rose-100",   dot: "bg-rose-500" },
  Pending:    { bg: "bg-amber-50",   text: "text-amber-600",  border: "border-amber-100",  dot: "bg-amber-500" },
  Completed:  { bg: "bg-slate-100",  text: "text-slate-500",  border: "border-slate-200",  dot: "bg-slate-400" },
};

const APPOINTMENT_COLORS: Record<string, string> = {
  Confirmed: "bg-blue-500",
  Urgent:    "bg-rose-500",
  Pending:   "bg-amber-400",
  Completed: "bg-slate-400",
};

const INITIAL_APPOINTMENTS = [
  { id: 1, patient: "John Smith",     time: "09:00", duration: 30, type: "Follow-up",    status: "Confirmed", day: 1, avatar: "JS" },
  { id: 2, patient: "Sarah Johnson",  time: "10:00", duration: 45, type: "Consultation", status: "Confirmed", day: 1, avatar: "SJ" },
  { id: 3, patient: "Michael Chen",   time: "11:30", duration: 30, type: "Check-up",     status: "Pending",   day: 1, avatar: "MC" },
  { id: 4, patient: "Emma Davis",     time: "14:00", duration: 60, type: "Emergency",    status: "Urgent",    day: 1, avatar: "ED" },
  { id: 5, patient: "Raj Patel",      time: "10:00", duration: 30, type: "Follow-up",    status: "Confirmed", day: 2, avatar: "RP" },
  { id: 6, patient: "Priya Sharma",   time: "14:30", duration: 45, type: "Consultation", status: "Pending",   day: 3, avatar: "PS" },
  { id: 7, patient: "Leon Torres",    time: "09:30", duration: 30, type: "Check-up",     status: "Confirmed", day: 4, avatar: "LT" },
  { id: 8, patient: "Aisha Khan",     time: "16:00", duration: 30, type: "Follow-up",    status: "Confirmed", day: 5, avatar: "AK" },
];

function getCountdown(timeStr: string): string {
  const now = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  const apt = new Date(now);
  apt.setHours(h, m, 0, 0);
  const diff = apt.getTime() - now.getTime();
  if (diff < 0) return "past";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  return `in ${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const Schedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null);
  const [now, setNow] = useState(new Date());
  const [newApt, setNewApt] = useState({
    patient: "", type: "Consultation", status: "Confirmed", duration: "30",
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Build week dates
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + weekOffset * 7);

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const todayDay = now.getDay();
  const todayApts = appointments
    .filter((a) => a.day === todayDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleCellClick = (day: number, hour: number) => {
    setSelectedCell({ day, hour });
    setNewApt({ patient: "", type: "Consultation", status: "Confirmed", duration: "30" });
    setAddOpen(true);
  };

  const handleAddSlot = () => {
    if (!newApt.patient || !selectedCell) return;
    const id = Date.now();
    setAppointments((prev) => [
      ...prev,
      {
        id,
        patient: newApt.patient,
        time: `${String(selectedCell.hour).padStart(2, "0")}:00`,
        duration: Number(newApt.duration),
        type: newApt.type,
        status: newApt.status,
        day: selectedCell.day,
        avatar: newApt.patient.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      },
    ]);
    setAddOpen(false);
  };

  const getAptForCell = (day: number, hour: number) =>
    appointments.find((a) => {
      const [h] = a.time.split(":").map(Number);
      return a.day === day && h === hour;
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader />

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14213D] flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#F2052C]" /> My Schedule
          </h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">
            {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} –{" "}
            {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/60 border border-white/60 rounded-[14px] p-1">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="h-8 w-8 rounded-[10px] flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 h-8 rounded-[10px] text-xs font-extrabold text-[#F2052C] hover:bg-rose-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="h-8 w-8 rounded-[10px] flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <Button
            onClick={() => { setSelectedCell({ day: todayDay, hour: 9 }); setAddOpen(true); }}
            className="bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white rounded-[14px] border-none shadow-md shadow-[#F2052C]/20 hover:opacity-90 h-9"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Slot
          </Button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            {status}
          </div>
        ))}
      </div>

      {/* Main Layout: Calendar + Today Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Week Grid */}
        <div className="xl:col-span-3 bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-slate-100">
            <div className="p-3 border-r border-slate-100" />
            {weekDates.map((date, i) => {
              const isToday = date.toDateString() === now.toDateString();
              return (
                <div key={i} className={`p-3 text-center border-r border-slate-100 last:border-r-0 ${isToday ? "bg-[#F2052C]/5" : ""}`}>
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isToday ? "text-[#F2052C]" : "text-slate-400"}`}>
                    {DAYS[i]}
                  </p>
                  <p className={`text-lg font-extrabold mt-0.5 ${isToday ? "text-[#F2052C]" : "text-[#14213D]"}`}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="overflow-y-auto max-h-[480px] custom-scrollbar">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                {/* Time Label */}
                <div className="p-3 border-r border-slate-100 flex items-start">
                  <span className="text-[10px] font-bold text-slate-300 uppercase">
                    {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : `${hour}am`}
                  </span>
                </div>
                {/* Day Cells */}
                {weekDates.map((_, dayIdx) => {
                  const apt = getAptForCell(dayIdx, hour);
                  const isToday = dayIdx === now.getDay() && weekOffset === 0;
                  const isCurrentHour = isToday && now.getHours() === hour;
                  return (
                    <div
                      key={dayIdx}
                      onClick={() => !apt && handleCellClick(dayIdx, hour)}
                      className={`border-r border-slate-50 last:border-r-0 p-1 min-h-[56px] cursor-pointer relative ${
                        isToday ? "bg-[#F2052C]/2" : ""
                      } ${!apt ? "hover:bg-slate-50/60" : ""}`}
                    >
                      {/* Current time line */}
                      {isCurrentHour && (
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#F2052C]/40 z-10 pointer-events-none" />
                      )}
                      {apt && (
                        <div
                          className={`rounded-[10px] p-1.5 text-white text-[10px] font-bold overflow-hidden cursor-default ${APPOINTMENT_COLORS[apt.status]}`}
                        >
                          <p className="truncate leading-tight">{apt.patient}</p>
                          <p className="opacity-80 text-[9px]">{apt.type}</p>
                        </div>
                      )}
                      {!apt && (
                        <div className="opacity-0 group-hover:opacity-100 absolute inset-1 rounded-[10px] border-2 border-dashed border-slate-200 flex items-center justify-center transition-opacity pointer-events-none">
                          <Plus className="h-3 w-3 text-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Agenda Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Timer className="h-4 w-4 text-[#F2052C]" />
              <h3 className="text-sm font-extrabold text-[#14213D]">Today's Agenda</h3>
            </div>
            {todayApts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-semibold">All clear today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayApts.map((apt) => {
                  const cfg = STATUS_CONFIG[apt.status];
                  const countdown = getCountdown(apt.time);
                  const isNext = countdown !== "past" && todayApts.find((a) => getCountdown(a.time) !== "past") === apt;
                  return (
                    <div key={apt.id} className={`p-3 rounded-[16px] border ${cfg.bg} ${cfg.border} relative`}>
                      {isNext && (
                        <span className="absolute -top-1.5 left-3 text-[9px] font-extrabold uppercase tracking-wider bg-[#F2052C] text-white px-2 py-0.5 rounded-full">
                          Next Up
                        </span>
                      )}
                      <div className="flex items-start gap-3 mt-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F2052C] to-[#35B7C9] flex items-center justify-center text-white font-extrabold text-[10px] shrink-0">
                          {apt.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-[#14213D] truncate">{apt.patient}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{apt.type} · {apt.duration}min</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-[#F2052C]">{apt.time}</span>
                        <span className={`text-[10px] font-bold ${countdown === "past" ? "text-slate-300" : "text-emerald-600"}`}>
                          {countdown}
                        </span>
                      </div>
                      {apt.status === "Urgent" && (
                        <div className="flex items-center gap-1 mt-2">
                          <Button size="sm" className="w-full h-7 text-[10px] font-bold bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white border-none rounded-[10px]">
                            <Video className="h-3 w-3 mr-1" /> Join Now
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats mini-card */}
          <div className="bg-gradient-to-br from-[#14213D] to-[#1e3a5f] rounded-[24px] p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/50 mb-3">Today's Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total", value: todayApts.length, color: "text-white" },
                { label: "Urgent", value: todayApts.filter((a) => a.status === "Urgent").length, color: "text-rose-400" },
                { label: "Confirmed", value: todayApts.filter((a) => a.status === "Confirmed").length, color: "text-blue-400" },
                { label: "Pending", value: todayApts.filter((a) => a.status === "Pending").length, color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-[14px] p-2.5 text-center">
                  <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Slot Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[24px] border-none shadow-2xl bg-white/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#14213D] flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#F2052C]" /> Add Appointment Slot
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Patient Name
              </Label>
              <Input
                value={newApt.patient}
                onChange={(e) => setNewApt({ ...newApt, patient: e.target.value })}
                placeholder="Full name"
                className="rounded-[14px] border-slate-200 h-10 font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Type</Label>
                <Select value={newApt.type} onValueChange={(v) => setNewApt({ ...newApt, type: v })}>
                  <SelectTrigger className="rounded-[14px] border-slate-200 h-10 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</Label>
                <Select value={newApt.status} onValueChange={(v) => setNewApt({ ...newApt, status: v })}>
                  <SelectTrigger className="rounded-[14px] border-slate-200 h-10 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Duration</Label>
              <Select value={newApt.duration} onValueChange={(v) => setNewApt({ ...newApt, duration: v })}>
                <SelectTrigger className="rounded-[14px] border-slate-200 h-10 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1 rounded-[14px] h-10 font-bold border-slate-200">
                Cancel
              </Button>
              <Button
                onClick={handleAddSlot}
                disabled={!newApt.patient}
                className="flex-1 rounded-[14px] h-10 font-bold bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white border-none shadow-md"
              >
                Add Slot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
