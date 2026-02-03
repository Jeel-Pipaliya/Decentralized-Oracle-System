import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "accent";
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon: Icon,
  variant = "default"
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const iconColorClass = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    accent: "text-accent",
  }[variant];

  const glowClass = {
    default: "group-hover:shadow-primary/20",
    success: "group-hover:shadow-success/20",
    warning: "group-hover:shadow-warning/20",
    accent: "group-hover:shadow-accent/20",
  }[variant];

  return (
    <div className={`metric-card group ${glowClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-secondary/50 ${iconColorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-success" : isNegative ? "text-destructive" : "text-muted-foreground"
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-3xl font-heading font-bold">{value}</p>
        {changeLabel && (
          <p className="text-xs text-muted-foreground">{changeLabel}</p>
        )}
      </div>
    </div>
  );
}
