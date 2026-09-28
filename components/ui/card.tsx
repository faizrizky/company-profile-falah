import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Glow } from "@/components/common/section-ui";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  // `group`: the built-in glow (and children) react to hovering the card.
  "group relative overflow-clip rounded-lg border border-accent/50 transition-[transform,background-color] duration-300 hover:bg-accent/5",
  {
    variants: {
      /** glass: the design's translucent, blurred card background. */
      surface: {
        glass: "bg-surface-dark/5 backdrop-blur-[5px]",
        none: "",
      },
      /** Grows slightly on hover (lift = cards, subtle = large tiles). */
      hover: {
        lift: "hover:scale-[1.03]",
        subtle: "hover:scale-[1.02]",
        none: "",
      },
    },
    defaultVariants: { surface: "glass", hover: "none" },
  },
);

/**
 * The design's bordered card (blue outline, glass background) with the thin
 * glow along its top edge; on hover the glow brightens and the card tints blue.
 */
export function Card({
  surface,
  hover,
  glow = true,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants> & { glow?: boolean }) {
  return (
    <div className={cn(cardVariants({ surface, hover }), className)} {...props}>
      {glow && <Glow />}
      {children}
    </div>
  );
}
