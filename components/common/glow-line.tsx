import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * The design's glowing blue line: thickest in the middle, tapering to a
 * point at both ends. `width` is its length (px number or any CSS length,
 * e.g. "80%"); position it with `className`.
 */
export function GlowLine({
  width = "100%",
  thickness = 4,
  className,
}: {
  width?: number | string;
  thickness?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none max-w-full drop-shadow-[0_0_6px_rgba(24,102,239,0.9)]", className)}
      style={{ width } as CSSProperties}
    >
      <div
        className="w-full bg-[linear-gradient(90deg,#1c4fd8,#2f6bff_50%,#1c4fd8)] [clip-path:polygon(0_50%,6%_25%,50%_0,94%_25%,100%_50%,94%_75%,50%_100%,6%_75%)]"
        style={{ height: thickness }}
      />
    </div>
  );
}
