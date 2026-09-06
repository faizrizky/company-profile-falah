import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-accent/50 blur-[50px]",
        className,
      )}
    />
  );
}

export function Head({
  pill,
  title,
  desc,
  className,
}: {
  pill?: string;
  title: ReactNode;
  desc: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col items-center gap-3 text-center", className)}>
      {pill && (
        <span className="hidden items-center rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm leading-6 text-white backdrop-blur-sm md:inline-flex">
          {pill}
        </span>
      )}
      <h2 className="max-w-[900px] font-display text-[20px] font-bold leading-6 text-accent md:text-[30px] md:leading-9">
        {title}
      </h2>
      <p className="max-w-[720px] text-sm leading-5 text-white md:text-base md:leading-6">
        {desc}
      </p>
    </div>
  );
}
