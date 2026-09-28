import type { ReactNode } from "react";

import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

/**
 * Content that slides up into view when the surrounding `group` (a card) is
 * hovered or focused — the Figma cards' "Variant2" state.
 */
export function HoverReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,transform] duration-300 ease-out",
        "translate-y-2 group-hover:translate-y-0 group-hover:grid-rows-[1fr] group-hover:opacity-100",
        "group-focus-visible:translate-y-0 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/** "Recommended For" + keyword chips, as on the product cards. */
export function TagList({
  label,
  tags,
  className,
}: {
  label?: string | null;
  tags?: string[] | null;
  /** Gap between label and chips (Figma: 8px on product cards, 4px on the featured card). */
  className?: string;
}) {
  if (!tags?.length) return null;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span className="text-xs font-semibold leading-4 text-white">{label}</span>}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Pill key={tag} size="xs" className="px-2 leading-4">
            {tag}
          </Pill>
        ))}
      </div>
    </div>
  );
}
