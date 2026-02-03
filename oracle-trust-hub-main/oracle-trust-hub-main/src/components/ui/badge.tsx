import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]",
        warning: "border-transparent bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]",
        pending: "border-transparent bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] animate-pulse",
        verified: "border-transparent bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]",
        failed: "border-transparent bg-destructive/20 text-destructive",
        online: "border-transparent bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]",
        offline: "border-transparent bg-destructive/20 text-destructive",
        glow: "border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
