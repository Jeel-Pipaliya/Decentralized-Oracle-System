import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  TrendingUp, 
  Coins, 
  AlertTriangle,
  Play,
  Square,
  ArrowUpRight
} from "lucide-react";

const nodeStats = [
  { label: "Your Nodes", value: "3", icon: Server, color: "text-primary" },
  { label: "Total Staked", value: "50,000 LINK", icon: Coins, color: "text-success" },
  { label: "Rewards Earned", value: "1,247 LINK", icon: TrendingUp, color: "text-accent" },
  { label: "Penalties", value: "0", icon: AlertTriangle, color: "text-warning" },
];

const userNodes = [
  {
    id: "node-alpha-01",
    name: "Alpha Production",
    status: "online",
    uptime: 99.97,
    latency: "42ms",
    assignedJobs: 1247,
    stake: "20,000 LINK",
    reputation: 98,
    rewards: "523 LINK",
  },
  {
    id: "node-beta-02",
    name: "Beta Backup",
    status: "online",
    uptime: 99.85,
    latency: "48ms",
    assignedJobs: 892,
    stake: "15,000 LINK",
    reputation: 96,
    rewards: "412 LINK",
  },
  {
    id: "node-gamma-03",
    name: "Gamma Testing",
    status: "offline",
    uptime: 87.23,
    latency: "-",
    assignedJobs: 0,
    stake: "15,000 LINK",
    reputation: 72,
    rewards: "312 LINK",
  },
];

export default function Nodes() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Node <span className="text-gradient-primary">Operator</span> Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your oracle nodes, monitor performance, and track rewards.
              </p>
            </div>
            <Button variant="hero" size="lg" className="gap-2">
              <Server className="w-5 h-5" />
              Register New Node
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {nodeStats.map((stat) => (
              <div key={stat.label} className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-secondary/50">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nodes List */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-heading font-semibold">Your Nodes</h2>
            </div>

            <div className="divide-y divide-border/30">
              {userNodes.map((node) => (
                <div key={node.id} className="p-6 hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Node Info */}
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10">
                        <Server className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-heading font-semibold text-lg">{node.name}</h3>
                          <Badge variant={node.status === "online" ? "online" : "offline"}>
                            {node.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{node.id}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                        <p className={`font-semibold ${node.uptime >= 99 ? "text-success" : node.uptime >= 90 ? "text-warning" : "text-destructive"}`}>
                          {node.uptime}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Latency</p>
                        <p className="font-semibold">{node.latency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reputation</p>
                        <p className={`font-semibold ${node.reputation >= 90 ? "text-success" : node.reputation >= 70 ? "text-warning" : "text-destructive"}`}>
                          {node.reputation}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rewards</p>
                        <p className="font-semibold text-accent">{node.rewards}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {node.status === "online" ? (
                        <Button variant="outline" size="sm" className="gap-2">
                          <Square className="w-4 h-4" />
                          Stop
                        </Button>
                      ) : (
                        <Button variant="success" size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Start
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-2">
                        View Logs
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
