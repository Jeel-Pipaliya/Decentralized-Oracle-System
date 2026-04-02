import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cloud, Shield, Zap, Database, Layers, BarChart3,
  ArrowRight, GitBranch, Cpu, Leaf, Plane, Building2,
  Tractor, AlertTriangle, ChevronRight
} from "lucide-react";
import heroImage from "@/assets/hero-oracle.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Landing = () => {
  const features = [
    { icon: GitBranch, title: "Multiple Oracle Nodes", desc: "Three independent nodes fetch weather data, preventing single points of failure." },
    { icon: Shield, title: "Median Aggregation", desc: "Outlier-resistant median calculation ensures only accurate data reaches the blockchain." },
    { icon: Database, title: "On-Chain Storage", desc: "Final trusted weather results stored immutably on the Ethereum blockchain." },
    { icon: Leaf, title: "Crop Insurance", desc: "Automated smart contract payouts triggered by real weather conditions." },
    { icon: Zap, title: "Real-Time Data", desc: "Live weather feeds from OpenWeatherMap API powering oracle submissions." },
    { icon: Layers, title: "Round-Based System", desc: "Structured submission rounds with aggregation and automatic progression." },
  ];

  const useCases = [
    { icon: Leaf, title: "Crop Insurance", desc: "Automatic drought/flood payouts for farmers" },
    { icon: AlertTriangle, title: "Disaster Alerts", desc: "On-chain triggers for emergency response" },
    { icon: Plane, title: "Flight Insurance", desc: "Weather-based flight delay compensation" },
    { icon: Building2, title: "Smart Cities", desc: "Decentralized weather monitoring infrastructure" },
    { icon: Tractor, title: "Smart Agriculture", desc: "Data-driven farming decisions on blockchain" },
  ];

  const steps = [
    { num: "01", title: "Fetch", desc: "Oracle nodes fetch live weather data from OpenWeatherMap API" },
    { num: "02", title: "Submit", desc: "Each node submits temperature and rainfall to the smart contract" },
    { num: "03", title: "Aggregate", desc: "Owner triggers median aggregation to filter outliers" },
    { num: "04", title: "Execute", desc: "Consumer contracts read weather and trigger automated payouts" },
  ];

  const techStack = [
    { label: "Solidity", category: "Smart Contracts" },
    { label: "Hardhat", category: "Development" },
    { label: "Ethers.js", category: "Blockchain SDK" },
    { label: "React", category: "Frontend" },
    { label: "Node.js", category: "Oracle Nodes" },
    { label: "OpenWeatherMap", category: "Data Source" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative container mx-auto px-4 py-24 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <span className="node-pulse bg-primary text-primary" />
                  Decentralized Oracle Network
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
              >
                Trusted Weather Data{" "}
                <span className="text-gradient">On-Chain</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                A blockchain-based decentralized oracle system that fetches real-world weather
                data from multiple nodes, using median aggregation for reliable smart contract integration.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]"
                >
                  <BarChart3 className="h-4 w-4" />
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/Jeel-Pipaliya/Decentralized-Oracle-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground transition-all hover:bg-secondary/80"
                >
                  View on GitHub
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img src={heroImage} alt="Decentralized Oracle Network Visualization" className="w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 glow-card p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-oracle-green/10 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-oracle-green" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Node Status</p>
                    <p className="text-sm font-bold text-oracle-green">3/3 Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-black tracking-tight">
              Key <span className="text-gradient">Features</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              Built for reliability, security, and real-world smart contract integration.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glow-card p-6 space-y-4"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-black tracking-tight">
              How It <span className="text-gradient">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              From real-world API data to on-chain trusted results in four steps.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative glow-card p-6 space-y-3"
              >
                <span className="text-4xl font-black text-primary/20 font-mono">{step.num}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-black tracking-tight">
              Real-World <span className="text-gradient">Use Cases</span>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glow-card p-5 text-center space-y-3"
              >
                <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <uc.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold">{uc.title}</h3>
                <p className="text-xs text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-24 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-black tracking-tight">
              Tech <span className="text-gradient">Stack</span>
            </motion.h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glow-card px-6 py-4 text-center space-y-1"
              >
                <p className="text-sm font-bold">{tech.label}</p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-border">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to explore the <span className="text-gradient">Oracle System</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            View live weather data, oracle node statuses, and crop insurance payouts on the dashboard.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]"
          >
            <BarChart3 className="h-4 w-4" />
            Launch Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">WeatherOracle</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Decentralized Weather Oracle System — Built with Solidity, Hardhat & React
          </p>
          <a
            href="https://github.com/Jeel-Pipaliya/Decentralized-Oracle-System"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
