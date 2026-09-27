import type { ReactNode } from "react";

import { GlowLine } from "@/components/common/glow-line";
import { cn } from "@/lib/utils";

/** The design's tab (solution categories, product tabs): glow line on top when active. */
export function TabButton({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative flex h-12 w-[243px] shrink-0 items-center justify-center rounded-lg border px-4 text-center text-sm font-bold leading-4 text-white backdrop-blur-[5px] transition-all duration-300",
        active ? "border-accent/50 bg-accent/5" : "border-[#3d3d3d]/50 bg-surface-dark/5 hover:border-accent/30",
        className,
      )}
    >
      {active && <GlowLine width={170} thickness={5} className="absolute left-1/2 top-[-3px] -translate-x-1/2" />}
      {children}
    </button>
  );
}
