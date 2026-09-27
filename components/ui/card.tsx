import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg border border-accent/50", {
  variants: {
    /** glass: the design's translucent, blurred card background. */
    surface: {
      glass: "bg-surface-dark/5 backdrop-blur-[5px]",
      none: "",
    },
    /** Grows slightly on hover (lift = cards, subtle = large tiles). */
    hover: {
      lift: "transition-transform duration-300 hover:scale-[1.03]",
      subtle: "transition-transform duration-300 hover:scale-[1.02]",
      none: "",
    },
  },
  defaultVariants: { surface: "glass", hover: "none" },
});

/** The design's bordered card (blue outline, glass background). */
export function Card({
  surface,
  hover,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ surface, hover }), className)} {...props} />;
}
