import { Shield, Zap, Lock, Globe, BarChart3, Code } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Cryptographic Security",
    description: "Every data point is signed and verified through multi-party computation protocols.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second response times with optimized consensus mechanisms.",
  },
  {
    icon: Lock,
    title: "Tamper-Proof",
    description: "Immutable data aggregation with on-chain verification.",
  },
  {
    icon: Globe,
    title: "Multi-Chain",
    description: "Native support for Ethereum, Polygon, Arbitrum, and more.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor your oracle requests with detailed performance metrics.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Simple APIs and comprehensive SDKs for easy integration.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Choose <span className="text-gradient-accent">OracleNet</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for security, speed, and reliability in the Web3 ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 group hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 group-hover:from-primary/30 group-hover:to-accent/20 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
