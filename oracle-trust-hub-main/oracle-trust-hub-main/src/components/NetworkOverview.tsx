import { MetricCard } from "./MetricCard";
import { Server, Activity, Zap, Clock } from "lucide-react";

export function NetworkOverview() {
  const metrics = [
    {
      title: "Total Oracle Nodes",
      value: "847",
      change: 12.5,
      changeLabel: "vs last month",
      icon: Server,
      variant: "default" as const,
    },
    {
      title: "Active Data Feeds",
      value: "1,234",
      change: 8.2,
      changeLabel: "vs last month",
      icon: Activity,
      variant: "success" as const,
    },
    {
      title: "Requests Today",
      value: "2.4M",
      change: 23.1,
      changeLabel: "vs yesterday",
      icon: Zap,
      variant: "accent" as const,
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: -15.3,
      changeLabel: "faster than avg",
      icon: Clock,
      variant: "warning" as const,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Network <span className="text-gradient-primary">Statistics</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time metrics from our decentralized oracle network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MetricCard {...metric} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
