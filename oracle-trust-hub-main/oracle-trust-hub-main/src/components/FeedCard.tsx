import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Database, Star, Zap } from "lucide-react";

interface FeedCardProps {
  name: string;
  description: string;
  category: string;
  updateFrequency: string;
  sources: number;
  reliability: number;
  pricePerRequest: string;
}

export function FeedCard({
  name,
  description,
  category,
  updateFrequency,
  sources,
  reliability,
  pricePerRequest,
}: FeedCardProps) {
  return (
    <div className="feed-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg">{name}</h3>
            <Badge variant="secondary" className="mt-1">{category}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-warning">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{reliability}%</span>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-6">{description}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-sm font-medium">{updateFrequency}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Sources</p>
            <p className="text-sm font-medium">{sources}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-sm font-medium">{pricePerRequest}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="hero" className="flex-1">
          Subscribe
        </Button>
        <Button variant="outline">
          View Schema
        </Button>
      </div>
    </div>
  );
}
