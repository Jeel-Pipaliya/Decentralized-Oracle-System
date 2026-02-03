import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, MoreHorizontal } from "lucide-react";

interface Node {
  id: string;
  name: string;
  status: "online" | "offline";
  uptime: number;
  latency: string;
  jobs: number;
  reputation: number;
}

const mockNodes: Node[] = [
  { id: "node-1", name: "Alpha Node", status: "online", uptime: 99.9, latency: "45ms", jobs: 1247, reputation: 98 },
  { id: "node-2", name: "Beta Node", status: "online", uptime: 98.7, latency: "52ms", jobs: 983, reputation: 95 },
  { id: "node-3", name: "Gamma Node", status: "offline", uptime: 87.2, latency: "-", jobs: 0, reputation: 72 },
  { id: "node-4", name: "Delta Node", status: "online", uptime: 99.5, latency: "38ms", jobs: 1502, reputation: 99 },
];

export function NodeStatus() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-heading font-semibold">Node Status</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Active oracle node operators
          </p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {mockNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/50">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{node.name}</span>
                  <Badge variant={node.status === "online" ? "online" : "offline"}>
                    {node.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Uptime: {node.uptime}%</span>
                  <span>Latency: {node.latency}</span>
                  <span>Jobs: {node.jobs}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Reputation</p>
                <p className={`text-lg font-heading font-bold ${
                  node.reputation >= 90 ? "text-success" : 
                  node.reputation >= 70 ? "text-warning" : "text-destructive"
                }`}>
                  {node.reputation}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
