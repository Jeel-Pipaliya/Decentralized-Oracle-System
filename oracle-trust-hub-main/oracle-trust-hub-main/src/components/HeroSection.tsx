import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      
      {/* Floating Hexagons */}
      <div className="absolute top-20 right-20 opacity-20 animate-float" style={{ animationDelay: "-1s" }}>
        <Hexagon className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20 animate-float" style={{ animationDelay: "-2s" }}>
        <Hexagon className="w-12 h-12 text-accent" />
      </div>
      <div className="absolute top-1/2 right-40 opacity-20 animate-float" style={{ animationDelay: "-4s" }}>
        <Hexagon className="w-8 h-8 text-success" />
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <span className="status-dot status-dot-online" />
            <span className="text-sm text-primary font-medium">Network Live • 847 Active Nodes</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Decentralized Oracles for{" "}
            <span className="text-gradient-primary">Trustless</span>{" "}
            Smart Contracts
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Reliable, tamper-proof, and verifiable off-chain data delivered on-chain with cryptographic guarantees.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/developers">
              <Button variant="hero" size="xl" className="gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="gap-2">
              <BookOpen className="w-5 h-5" />
              View Documentation
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm text-muted-foreground mb-6">Securing value across leading protocols</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche"].map((chain) => (
                <div key={chain} className="flex items-center gap-2 text-lg font-heading font-medium text-muted-foreground">
                  <Hexagon className="w-5 h-5" />
                  {chain}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
