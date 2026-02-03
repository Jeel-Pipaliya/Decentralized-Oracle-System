import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";

export function LiveStats() {
  const stats = [
    {
      label: "Active Requests",
      value: "47",
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Verified Today",
      value: "2,847",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Failed Today",
      value: "23",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Avg. Latency",
      value: "1.2s",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
