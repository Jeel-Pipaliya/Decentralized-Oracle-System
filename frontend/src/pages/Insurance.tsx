import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, Leaf, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, TrendingUp, CloudRain, Thermometer, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_INSURANCE = {
  paid: false,
  thresholdRainfall: 10,
  lastProcessedRound: 0,
  lastPayoutAmountEth: "0.0",
  balance: "10.0",
  claimsCount: 0,
  activePolicies: 1,
};

const MOCK_WEATHER = {
  temperature: 28,
  rainfall: 0,
  currentRound: 4,
  lastAggregatedRound: 3,
};

const MOCK_PAYOUTS = [
  { round: 1, rainfall: 5, triggered: true, amount: "0.5", timestamp: "2024-01-15" },
  { round: 2, rainfall: 8, triggered: false, amount: "0", timestamp: "2024-01-14" },
];

const API_BASE = "http://localhost:3000";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

interface InsuranceData {
  paid: boolean;
  thresholdRainfall: number;
  lastProcessedRound: number;
  lastPayoutAmountEth: string;
  balance: string;
  claimsCount: number;
  activePolicies: number;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  currentRound: number;
  lastAggregatedRound: number;
}

interface PayoutRecord {
  round: number;
  rainfall: number;
  triggered: boolean;
  amount: string;
  timestamp: string;
}

const Insurance = () => {
  const [insurance, setInsurance] = useState<InsuranceData>(MOCK_INSURANCE);
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(MOCK_PAYOUTS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLive, setIsLive] = useState(false);

  const riskLevel = weather.rainfall > insurance.thresholdRainfall ? "High" : "Low";
  const riskColor = riskLevel === "High" ? "text-oracle-red" : "text-oracle-green";

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const overviewRes = await fetch(`${API_BASE}/api/system/overview`);
      if (!overviewRes.ok) throw new Error("Failed to fetch");
      const overview = await overviewRes.json();
      setWeather(overview.weather);
      setInsurance(overview.insurance);
      setIsLive(true);
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerPayoutCheck = async () => {
    try {
      setMessage("Processing payout claim...");
      const res = await fetch(`${API_BASE}/api/insurance/check-pay`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      setMessage("✅ Payout processed successfully.");
      await loadData();
    } catch {
      setMessage("⚠️ Payout processing failed — ensure backend is running.");
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
                Crop <span className="text-gradient">Insurance</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor insurance policies, rainfall triggers, and automated payouts.
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
              icon: Leaf,
              label: "Active Policies",
              value: `${insurance.activePolicies}`,
              color: "text-oracle-green",
              bg: "bg-oracle-green/10",
              border: "border-oracle-green/20",
            },
            {
              icon: DollarSign,
              label: "Contract Balance",
              value: `${insurance.balance} ETH`,
              color: "text-oracle-amber",
              bg: "bg-oracle-amber/10",
              border: "border-oracle-amber/20",
            },
            {
              icon: TrendingUp,
              label: "Total Claims Paid",
              value: `${insurance.claimsCount}`,
              color: "text-primary",
              bg: "bg-primary/10",
              border: "border-primary/20",
            },
            {
              icon: CloudRain,
              label: "Risk Level",
              value: riskLevel,
              color: riskColor,
              bg: riskLevel === "High" ? "bg-oracle-red/10" : "bg-oracle-green/10",
              border: riskLevel === "High" ? "border-oracle-red/20" : "border-oracle-green/20",
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
          {/* Policy Details */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="glow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Leaf className="h-5 w-5 text-oracle-green" />
                Policy Details
              </h2>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                insurance.paid
                  ? "bg-oracle-green/10 text-oracle-green border border-oracle-green/20"
                  : "bg-oracle-amber/10 text-oracle-amber border border-oracle-amber/20"
              }`}>
                {insurance.paid ? "Claimed" : "Active"}
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Rainfall Threshold", value: `${insurance.thresholdRainfall} mm`, icon: CloudRain },
                { label: "Temperature", value: `${weather.temperature}°C`, icon: Thermometer },
                { label: "Current Rainfall", value: `${weather.rainfall} mm`, icon: CloudRain },
                { label: "Last Payout", value: `${insurance.lastPayoutAmountEth} ETH`, icon: DollarSign },
              ].map((item, idx) => (
                <div key={item.label} className="flex items-center justify-between py-3 px-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weather Trigger */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="glow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-oracle-amber" />
                Trigger Status
              </h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                weather.rainfall > insurance.thresholdRainfall
                  ? "bg-oracle-red/10 text-oracle-red border border-oracle-red/20"
                  : "bg-oracle-green/10 text-oracle-green border border-oracle-green/20"
              }`}>
                {weather.rainfall > insurance.thresholdRainfall ? "Triggered" : "Safe"}
              </span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rainfall vs Threshold</span>
                  <span className="text-sm font-semibold font-mono">{weather.rainfall} / {insurance.thresholdRainfall} mm</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary border border-border/50 overflow-hidden">
                  <div
                    className={`h-full transition-all ${weather.rainfall > insurance.thresholdRainfall ? "bg-oracle-red" : "bg-oracle-green"}`}
                    style={{ width: `${Math.min((weather.rainfall / insurance.thresholdRainfall) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {weather.rainfall > insurance.thresholdRainfall ? (
                    <CheckCircle className="h-4 w-4 text-oracle-red" />
                  ) : (
                    <XCircle className="h-4 w-4 text-oracle-green" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {weather.rainfall > insurance.thresholdRainfall
                      ? "Payout condition met - claim available"
                      : "Rainfall below threshold - no claim available"}
                  </span>
                </div>
              </div>

              <Button
                onClick={triggerPayoutCheck}
                disabled={weather.rainfall <= insurance.thresholdRainfall}
                className="w-full gap-2 bg-primary text-primary-foreground hover:brightness-110"
                size="lg"
              >
                <DollarSign className="h-4 w-4" />
                {weather.rainfall > insurance.thresholdRainfall ? "Claim Payout Now" : "Waiting for Trigger"}
              </Button>
            </div>
          </motion.div>

          {/* Payout History */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="glow-card p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-oracle-amber" />
                Payout History
              </h2>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                {payouts.length} records
              </span>
            </div>
            {payouts.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-5 px-4 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider gap-2">
                  <span>Round</span>
                  <span>Rainfall</span>
                  <span>Status</span>
                  <span>Amount</span>
                  <span>Date</span>
                </div>
                {payouts.map((payout) => (
                  <div
                    key={payout.round}
                    className="grid grid-cols-5 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-sm font-mono gap-2"
                  >
                    <span className="text-muted-foreground">#{payout.round}</span>
                    <span className="text-oracle-blue">{payout.rainfall} mm</span>
                    <span className={payout.triggered ? "text-oracle-green" : "text-muted-foreground"}>
                      {payout.triggered ? "✓ Paid" : "—"}
                    </span>
                    <span className="text-oracle-amber font-semibold">{payout.amount} ETH</span>
                    <span className="text-muted-foreground text-xs">{payout.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No payout records yet.</p>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8} className="glow-card p-6 space-y-4 lg:col-span-2">
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
                How It Works
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When real-world rainfall exceeds your policy threshold, a payout is automatically triggered. 
                The insurance contract reads aggregated weather data from the oracle and executes the claim. 
                Example: Threshold 10mm, Actual 15mm → Payout automatically processes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
