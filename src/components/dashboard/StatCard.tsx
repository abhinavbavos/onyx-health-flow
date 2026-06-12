import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success" | "warning";
}

// Animated counter hook
const useCountUp = (target: number, duration = 900) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isNaN(target) || target <= 0) {
      setCount(target);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
};

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "bg-white/70 backdrop-blur-md text-[#14213D] shadow-sm border border-white/60",
    primary: "bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white shadow-md border-none",
    secondary: "bg-gradient-to-r from-[#35B7C9] to-[#48D5E7] text-white shadow-md border-none",
    success: "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md border-none",
    warning: "bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white shadow-md border-none",
  };

  // Detect if value is numeric for counter animation
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numericValue) && String(value).match(/^\d/);
  const prefix = isNumeric ? String(value).match(/^[^0-9]*/)?.[0] || "" : "";
  const suffix = isNumeric ? String(value).match(/[^0-9]*$/)?.[0] || "" : "";
  const animatedCount = useCountUp(isNumeric ? numericValue : 0);

  const displayValue = isNumeric
    ? `${prefix}${animatedCount.toLocaleString()}${suffix}`
    : value;

  return (
    <div
      className={cn(
        "rounded-[24px] transition-all hover:scale-[1.02] hover:-translate-y-0.5 p-5 flex items-center justify-between cursor-default",
        variantStyles[variant]
      )}
      style={
        variant !== "default"
          ? { boxShadow: "0 12px 35px rgba(0,0,0,0.1)" }
          : {}
      }
    >
      <div className="space-y-1">
        <p className="text-xs font-bold opacity-80 tracking-wide uppercase">{title}</p>
        <p className="text-3xl font-extrabold leading-none pb-1 tabular-nums">{displayValue}</p>
        <p className="text-[10px] font-bold opacity-70 flex items-center gap-1 uppercase tracking-wider">
          {trend ? (
            <>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </>
          ) : (
            "↑ Live Data"
          )}
        </p>
      </div>
      <div
        className={cn(
          "h-12 w-12 rounded-[18px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
          variant === "default" ? "bg-[#F2052C]/8 text-[#F2052C]" : "bg-white/20 text-white"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatCard;
