import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "bg-card",
    primary: "gradient-primary text-white",
    secondary: "gradient-secondary text-white",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
  };

  return (
    <Card className={cn("shadow-card transition-all hover:shadow-lg", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "text-inherit opacity-90"
            )}>
              {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive",
                variant !== "default" && "text-inherit opacity-80"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            variant === "default" ? "bg-primary/10 text-primary" : "bg-white/20 text-inherit"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
