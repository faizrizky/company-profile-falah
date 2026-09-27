import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex w-fit items-center rounded-full border bg-surface-dark/5 px-4 py-1 text-white backdrop-blur-[5px]",
  {
    variants: {
      /** label: section/hero eyebrow (white border). tag: small keyword chip (blue border). */
      tone: {
        label: "border-white",
        tag: "border-accent",
      },
      size: {
        xs: "text-xs leading-[18px]",
        sm: "text-sm leading-6",
        md: "text-base font-medium leading-6",
      },
    },
    defaultVariants: { tone: "label", size: "sm" },
  },
);

/** The design's rounded pill: eyebrows above titles and keyword tags. */
export function Pill({
  tone,
  size,
  className,
  children,
}: VariantProps<typeof pillVariants> & { className?: string; children: ReactNode }) {
  return <span className={cn(pillVariants({ tone, size }), className)}>{children}</span>;
}
