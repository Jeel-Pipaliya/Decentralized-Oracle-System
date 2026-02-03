import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedCard } from "@/components/FeedCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const feeds = [
  {
    name: "ETH/USD",
    description: "Real-time Ethereum price feed aggregated from top exchanges.",
    category: "Finance",
    updateFrequency: "1 block",
    sources: 21,
    reliability: 99.9,
    pricePerRequest: "0.001 ETH",
  },
  {
    name: "BTC/USD",
    description: "Bitcoin price data with high-frequency updates.",
    category: "Finance",
    updateFrequency: "1 block",
    sources: 25,
    reliability: 99.8,
    pricePerRequest: "0.001 ETH",
  },
  {
    name: "Weather API",
    description: "Global weather data for smart insurance contracts.",
    category: "Weather",
    updateFrequency: "15 min",
    sources: 8,
    reliability: 98.5,
    pricePerRequest: "0.0005 ETH",
  },
  {
    name: "Sports Scores",
    description: "Live sports data for prediction markets and gaming.",
    category: "Sports",
    updateFrequency: "Real-time",
    sources: 12,
    reliability: 97.2,
    pricePerRequest: "0.002 ETH",
  },
  {
    name: "VRF Random",
    description: "Verifiable random function for fair on-chain randomness.",
    category: "Randomness",
    updateFrequency: "On-demand",
    sources: 15,
    reliability: 100,
    pricePerRequest: "0.003 ETH",
  },
  {
    name: "Flight Status",
    description: "Real-time flight data for travel insurance protocols.",
    category: "Travel",
    updateFrequency: "5 min",
    sources: 6,
    reliability: 96.8,
    pricePerRequest: "0.0015 ETH",
  },
];

const categories = ["All", "Finance", "Weather", "Sports", "Randomness", "Travel", "IoT"];

export default function DataFeeds() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeeds = feeds.filter((feed) => {
    const matchesCategory = activeCategory === "All" || feed.category === activeCategory;
    const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Data Feed <span className="text-gradient-primary">Marketplace</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse, compare, and subscribe to verified oracle data feeds for your smart contracts.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search data feeds..."
                className="pl-10 bg-secondary/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "glow" : "secondary"}
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeeds.map((feed, index) => (
              <div
                key={feed.name}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeedCard {...feed} />
              </div>
            ))}
          </div>

          {filteredFeeds.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No data feeds found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
