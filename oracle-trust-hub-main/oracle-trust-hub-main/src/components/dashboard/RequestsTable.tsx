import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

interface OracleRequest {
  id: string;
  contractAddress: string;
  dataType: string;
  status: "pending" | "verified" | "failed";
  responseTime: string;
  consensusScore: number;
  timestamp: string;
  nodes: number;
  value?: string;
}

const mockRequests: OracleRequest[] = [
  {
    id: "0x8f3a...2b4c",
    contractAddress: "0x1234...5678",
    dataType: "ETH/USD Price",
    status: "verified",
    responseTime: "1.2s",
    consensusScore: 98,
    timestamp: "2 min ago",
    nodes: 12,
    value: "$2,847.32",
  },
  {
    id: "0x7e2d...9a1f",
    contractAddress: "0xabcd...ef01",
    dataType: "Weather API",
    status: "pending",
    responseTime: "-",
    consensusScore: 0,
    timestamp: "Just now",
    nodes: 8,
  },
  {
    id: "0x6c1b...8e3d",
    contractAddress: "0x9876...5432",
    dataType: "BTC/USD Price",
    status: "verified",
    responseTime: "0.8s",
    consensusScore: 100,
    timestamp: "5 min ago",
    nodes: 15,
    value: "$67,234.89",
  },
  {
    id: "0x5a0c...7d2e",
    contractAddress: "0x2468...1357",
    dataType: "Random Number",
    status: "failed",
    responseTime: "3.2s",
    consensusScore: 45,
    timestamp: "8 min ago",
    nodes: 6,
  },
  {
    id: "0x4f9b...6c1a",
    contractAddress: "0xfedc...ba98",
    dataType: "Sports Score",
    status: "verified",
    responseTime: "1.5s",
    consensusScore: 95,
    timestamp: "12 min ago",
    nodes: 10,
    value: "Lakers 112 - 108 Celtics",
  },
];

export function RequestsTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getStatusBadge = (status: OracleRequest["status"]) => {
    switch (status) {
      case "verified":
        return <Badge variant="verified">Verified</Badge>;
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "failed":
        return <Badge variant="failed">Failed</Badge>;
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-xl font-heading font-semibold">Oracle Requests</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of oracle data requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-left">
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Request ID</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Contract</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Data Type</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Response Time</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Consensus</th>
              <th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {mockRequests.map((request) => (
              <>
                <tr
                  key={request.id}
                  className="table-row-interactive border-b border-border/30"
                  onClick={() => toggleRow(request.id)}
                >
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-primary">{request.id}</code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-muted-foreground">
                      {request.contractAddress}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">{request.dataType}</td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 text-sm">{request.responseTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            request.consensusScore >= 80
                              ? "bg-success"
                              : request.consensusScore >= 50
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${request.consensusScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {request.consensusScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {expandedRow === request.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </td>
                </tr>
                {expandedRow === request.id && (
                  <tr className="bg-secondary/30">
                    <td colSpan={7} className="px-6 py-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                          <p className="text-sm">{request.timestamp}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Participating Nodes</p>
                          <p className="text-sm">{request.nodes} nodes</p>
                        </div>
                        {request.value && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Final Value</p>
                            <p className="text-sm font-medium text-primary">{request.value}</p>
                          </div>
                        )}
                        <div className="flex items-end">
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
