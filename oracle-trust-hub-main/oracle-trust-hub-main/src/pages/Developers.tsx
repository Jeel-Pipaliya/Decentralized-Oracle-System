import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  Trash2,
  Plus,
  Code,
  Terminal,
  Play
} from "lucide-react";
import { useState } from "react";

const apiKeys = [
  { id: "key-1", name: "Production API", key: "orc_live_1a2b3c4d5e6f...", created: "2024-01-15", usage: "847,234 requests" },
  { id: "key-2", name: "Development API", key: "orc_test_9z8y7x6w5v...", created: "2024-01-20", usage: "12,456 requests" },
];

const codeExamples = {
  javascript: `import { OracleClient } from '@oraclenet/sdk';

const client = new OracleClient({
  apiKey: 'your-api-key',
  network: 'mainnet'
});

// Request price data
const price = await client.requestPrice({
  pair: 'ETH/USD',
  callback: '0x1234...5678'
});

console.log('Request ID:', price.requestId);`,
  python: `from oraclenet import OracleClient

client = OracleClient(
    api_key='your-api-key',
    network='mainnet'
)

# Request price data
price = client.request_price(
    pair='ETH/USD',
    callback='0x1234...5678'
)

print(f'Request ID: {price.request_id}')`,
  solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@oraclenet/contracts/OracleConsumer.sol";

contract PriceConsumer is OracleConsumer {
    uint256 public latestPrice;
    
    function requestPrice() external {
        bytes32 requestId = requestData(
            "ETH/USD",
            this.fulfillPrice.selector
        );
    }
    
    function fulfillPrice(
        bytes32 requestId,
        uint256 price
    ) external recordFulfillment(requestId) {
        latestPrice = price;
    }
}`,
};

export default function Developers() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("javascript");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Developer <span className="text-gradient-primary">Portal</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Access APIs, manage keys, and integrate oracle data into your smart contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Key Management */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-semibold">API Keys</h2>
                  <p className="text-sm text-muted-foreground">Manage your API credentials</p>
                </div>
                <Button variant="hero" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Key
                </Button>
              </div>

              <div className="divide-y divide-border/30">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{apiKey.name}</p>
                          <p className="text-xs text-muted-foreground">Created {apiKey.created}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{apiKey.usage}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 text-sm font-mono truncate">
                        {showKey === apiKey.id ? apiKey.key : "••••••••••••••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      >
                        {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiKey.key)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold mb-4">This Month</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-heading font-bold text-primary">859,690</p>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-heading font-bold text-success">99.7%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-heading font-bold text-accent">1.1s</p>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-3xl font-heading font-bold text-warning">0.85 ETH</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold mb-2">Rate Limits</h3>
                <p className="text-sm text-muted-foreground mb-4">Current plan: Pro Developer</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Requests per minute</span>
                      <span className="text-primary">847 / 1,000</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "84.7%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily requests</span>
                      <span className="text-success">28,450 / 100,000</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: "28.45%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="mt-12">
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-heading font-semibold">Code Examples</h2>
                    <p className="text-sm text-muted-foreground">Quick start integration guides</p>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border/50 px-6">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger
                      value="javascript"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                    >
                      JavaScript
                    </TabsTrigger>
                    <TabsTrigger
                      value="python"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                    >
                      Python
                    </TabsTrigger>
                    <TabsTrigger
                      value="solidity"
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3"
                    >
                      Solidity
                    </TabsTrigger>
                  </TabsList>
                </div>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang} className="m-0">
                    <div className="relative">
                      <pre className="p-6 overflow-x-auto text-sm">
                        <code className="text-muted-foreground">{code}</code>
                      </pre>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
