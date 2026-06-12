import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "There's nothing to display here yet.",
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 px-6 text-center animate-fadeIn",
        className
      )}
    >
      {/* Icon circle */}
      <div className="h-16 w-16 rounded-[20px] bg-[#F2052C]/6 border border-[#F2052C]/10 flex items-center justify-center mb-4 text-[#F2052C]">
        {Icon ? (
          <Icon className="h-7 w-7 opacity-60" />
        ) : (
          /* default empty inbox SVG */
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 opacity-60">
            <path
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22V12h6v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <p className="text-sm font-extrabold text-[#14213D] mb-1">{title}</p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2 bg-gradient-to-r from-[#F2052C] to-[#FF4B66] text-white text-xs font-bold rounded-[14px] shadow-md shadow-[#F2052C]/20 hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
