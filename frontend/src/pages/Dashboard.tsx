import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Thermometer, Droplets, RotateCw, Play, DollarSign,
  Cpu, RefreshCw, CheckCircle, XCircle, AlertTriangle,
  Layers, Hash, CloudRain
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for demonstration (when backend isn't running)
const MOCK_WEATHER = {
  temperature: 28,
  rainfall: 45,
  currentRound: 4,
  lastAggregatedRound: 3,
  submissionsCount: 3,
};

const MOCK_INSURANCE = {
  paid: false,
  thresholdRainfall: 50,
  lastProcessedRound: 2,
  lastPayoutAmountEth: "0.05",
};

const MOCK_NODES = [
  { nodeAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", authorized: true },
  { nodeAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", authorized: true },
  { nodeAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", authorized: true },
];

const MOCK_SUBMISSIONS = [
  { index: 0, temperature: 28, rainfall: 44 },
  { index: 1, temperature: 29, rainfall: 46 },
  { index: 2, temperature: 27, rainfall: 45 },
];

const API_BASE = "http://localhost:3000";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

interface WeatherData {
  temperature: number;
  rainfall: number;
  currentRound: number;
  lastAggregatedRound: number;
  submissionsCount: number;
}

interface InsuranceData {
  paid: boolean;
  thresholdRainfall: number;
  lastProcessedRound: number;
  lastPayoutAmountEth: string;
}

interface OracleNode {
  nodeAddress: string;
  authorized: boolean;
}

interface Submission {
  index: number;
  temperature: number;
  rainfall: number;
}

const Dashboard = () => {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [insurance, setInsurance] = useState<InsuranceData>(MOCK_INSURANCE);
  const [nodes, setNodes] = useState<OracleNode[]>(MOCK_NODES);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLive, setIsLive] = useState(false);

  const canAggregate = Number(weather?.submissionsCount || 0) >= 3;
  const hasFreshAggregate =
    Number(weather?.lastAggregatedRound || 0) > Number(insurance?.lastProcessedRound || 0);
  const canCheckPay = hasFreshAggregate && !insurance?.paid;

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const [overviewRes, submissionsRes, nodesRes] = await Promise.all([
        fetch(`${API_BASE}/api/system/overview`),
        fetch(`${API_BASE}/api/weather/submissions`),
        fetch(`${API_BASE}/api/oracle/nodes`),
      ]);
      if (!overviewRes.ok) throw new Error("Failed to fetch");
      const overview = await overviewRes.json();
      const subs = await submissionsRes.json();
      const nodesData = await nodesRes.json();
      setWeather(overview.weather);
      setInsurance(overview.insurance);
      setSubmissions(subs.entries || []);
      setNodes(nodesData.statuses || []);
      setIsLive(true);
    } catch {
      setIsLive(false);
      // Keep mock data
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerAggregate = async () => {
    try {
      setMessage("Aggregating...");
      const res = await fetch(`${API_BASE}/api/weather/aggregate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      setMessage("✅ Aggregation successful.");
      await loadData();
    } catch {
      setMessage("⚠️ Aggregation failed — ensure backend is running.");
    }
  };

  const triggerPayoutCheck = async () => {
    try {
      setMessage("Checking payout...");
      const res = await fetch(`${API_BASE}/api/insurance/check-pay`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      setMessage("✅ Payout check completed.");
      await loadData();
    } catch {
      setMessage("⚠️ Payout check failed — ensure backend is running.");
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Oracle <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor weather data, oracle nodes, and crop insurance status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${
                isLive
                  ? "border-oracle-green/30 bg-oracle-green/10 text-oracle-green"
                  : "border-oracle-amber/30 bg-oracle-amber/10 text-oracle-amber"
              }`}>
                <span className={`node-pulse ${isLive ? "bg-oracle-green text-oracle-green" : "bg-oracle-amber text-oracle-amber"}`} />
                {isLive ? "Live" : "Demo Mode"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Thermometer,
              label: "Temperature",
              value: `${weather.temperature}°C`,
              color: "text-oracle-amber",
              bg: "bg-oracle-amber/10",
              border: "border-oracle-amber/20",
            },
            {
              icon: Droplets,
              label: "Rainfall",
              value: `${weather.rainfall} mm`,
              color: "text-oracle-blue",
              bg: "bg-oracle-blue/10",
              border: "border-oracle-blue/20",
            },
            {
              icon: Layers,
              label: "Current Round",
              value: `#${weather.currentRound}`,
              color: "text-oracle-purple",
              bg: "bg-oracle-purple/10",
              border: "border-oracle-purple/20",
            },
            {
              icon: Hash,
              label: "Submissions",
              value: `${weather.submissionsCount}`,
              color: "text-primary",
              bg: "bg-primary/10",
              border: "border-primary/20",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
              className="glow-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className={`stat-value ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Insurance Status */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="glow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-oracle-blue" />
                Insurance Status
              </h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                insurance.paid
                  ? "bg-oracle-green/10 text-oracle-green border border-oracle-green/20"
                  : "bg-oracle-amber/10 text-oracle-amber border border-oracle-amber/20"
              }`}>
                {insurance.paid ? "Paid" : "Pending"}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Threshold Rainfall", value: `${insurance.thresholdRainfall} mm` },
                { label: "Last Processed Round", value: `#${insurance.lastProcessedRound}` },
                { label: "Last Payout", value: `${insurance.lastPayoutAmountEth} ETH` },
                { label: "Status", value: insurance.paid ? "Claimed" : "Active" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Oracle Nodes */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="glow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-oracle-green" />
                Oracle Nodes
              </h2>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                {nodes.length} configured
              </span>
            </div>
            <div className="space-y-3">
              {nodes.map((node, idx) => (
                <div
                  key={node.nodeAddress}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      node.authorized
                        ? "bg-oracle-green/10 text-oracle-green border border-oracle-green/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}>
                      N{idx + 1}
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {node.nodeAddress.slice(0, 10)}...{node.nodeAddress.slice(-6)}
                    </span>
                  </div>
                  {node.authorized ? (
                    <CheckCircle className="h-4 w-4 text-oracle-green" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Current Round Submissions */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="glow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <RotateCw className="h-5 w-5 text-oracle-purple" />
                Round Submissions
              </h2>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                {submissions.length} records
              </span>
            </div>
            {submissions.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 px-4 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <span>#</span>
                  <span>Temp</span>
                  <span>Rainfall</span>
                </div>
                {submissions.map((entry) => (
                  <div
                    key={entry.index}
                    className="grid grid-cols-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-sm font-mono"
                  >
                    <span className="text-muted-foreground">{entry.index + 1}</span>
                    <span className="text-oracle-amber font-semibold">{entry.temperature}°C</span>
                    <span className="text-oracle-blue font-semibold">{entry.rainfall} mm</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No submissions in current round.</p>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8} className="glow-card p-6 space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Actions
            </h2>
            <div className="space-y-3">
              <Button
                onClick={triggerAggregate}
                disabled={!canAggregate}
                className="w-full gap-2 bg-primary text-primary-foreground hover:brightness-110"
                size="lg"
              >
                <RotateCw className="h-4 w-4" />
                Aggregate Median
              </Button>
              <Button
                onClick={triggerPayoutCheck}
                disabled={!canCheckPay}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <DollarSign className="h-4 w-4" />
                Check & Pay Insurance
              </Button>
            </div>

            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm border ${
                message.includes("✅")
                  ? "bg-oracle-green/10 text-oracle-green border-oracle-green/20"
                  : message.includes("⚠️")
                  ? "bg-oracle-amber/10 text-oracle-amber border-oracle-amber/20"
                  : "bg-secondary text-muted-foreground border-border"
              }`}>
                {message}
              </div>
            )}

            <div className="rounded-lg bg-secondary/50 border border-border/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                Aggregation Info
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Requires minimum 3 oracle submissions. Uses median to filter outliers.
                Values submitted: e.g. 30°C, 31°C, 100°C → Median = 31°C ✅
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
