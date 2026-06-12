import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  name?: string;
  role?: string;
  subtitle?: string;
}

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const formatDate = (): string =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (): string =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const roleTaglines: Record<string, string> = {
  "super-admin": "You have full system control. Stay vigilant.",
  "executive-admin": "Oversee your organizations and resources with clarity.",
  "cluster-head": "Your cluster is running strong. Keep up the momentum.",
  "user-head": "Manage your team and drive excellence.",
  nurse: "Every patient interaction matters. Thank you for your care.",
  technician: "Your devices keep the care flowing.",
  doctor: "Healing begins with your expertise.",
};

const WelcomeBanner = ({ name, role, subtitle }: WelcomeBannerProps) => {
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayRole = role?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "User";
  const tagline = subtitle || (role ? roleTaglines[role] : "") || "Welcome back.";

  return (
    <div
      className="relative overflow-hidden rounded-[24px] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn"
      style={{
        background: "linear-gradient(135deg, #35B7C9 0%, #148096 45%, #14213D 100%)",
        boxShadow: "0 20px 50px rgba(53, 183, 201, 0.2)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          filter: "blur(50px)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          filter: "blur(40px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Left: Greeting */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-[#F59E0B]" />
          <span className="text-xs font-bold text-[#E0F2FE] uppercase tracking-wider">
            {displayRole}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {getGreeting()}{name ? `, ${name.split(" ")[0]}` : ""}! 👋
        </h2>
        <p className="text-sm text-white/60 mt-1 font-medium">{tagline}</p>
      </div>

      {/* Right: Date & Time */}
      <div className="relative z-10 text-right sm:text-right">
        <p
          className="text-2xl font-extrabold tracking-wide tabular-nums text-white"
        >
          {time}
        </p>
        <p className="text-xs text-white/50 font-semibold mt-1 uppercase tracking-wider">
          {formatDate()}
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
