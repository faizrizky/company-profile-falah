import { Fragment, type ReactNode } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Renders CMS text with its line breaks preserved. In the visual editor the
 * value is an inline-editing element instead of a string; render it as-is.
 */
export function Lines({ text }: { text: ReactNode }) {
  if (typeof text !== "string") return <>{text}</>;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

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

/** Section heading used on About / Solution pages (pill hidden on mobile). */
export function Head({
  pill,
  title,
  desc,
  className,
}: {
  pill?: string | null;
  title: string;
  desc?: string | null;
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
        <Lines text={title} />
      </h2>
      {desc && (
        <p className="max-w-[720px] text-sm leading-5 text-white md:text-base md:leading-6">
          {desc}
        </p>
      )}
    </div>
  );
}

/** Section heading used on the Home page (pill always visible). */
export function SectionHeader({
  eyebrow,
  title,
  desc,
  className,
}: {
  eyebrow?: string | null;
  title: string;
  desc?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full max-w-[682px] flex-col items-center gap-3 text-center", className)}>
      {eyebrow && (
        <span className="flex items-center gap-1 rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm font-medium leading-6 text-white backdrop-blur-sm">
          {eyebrow}
        </span>
      )}
      <div className="flex w-full flex-col items-center gap-1">
        <h2 className="font-display text-[30px] font-bold leading-9 text-accent">
          <Lines text={title} />
        </h2>
        {desc && <p className="text-base leading-6 text-white">{desc}</p>}
      </div>
    </div>
  );
}

/** Full-bleed section with a dimmed background image (Home page style). */
export function Section({
  bg,
  className,
  children,
}: {
  bg?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn("relative isolate overflow-hidden px-6 py-12.5 lg:px-20", className)}
    >
      {bg && <Image src={bg} alt="" fill className="-z-20 object-cover" />}
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        {children}
      </div>
    </section>
  );
}

/** Background that swaps to a dedicated mobile image below md, when one is set. */
export function ResponsiveBackground({
  src,
  mobileSrc,
  className = "-z-20 object-cover",
  priority,
}: {
  src?: string;
  mobileSrc?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) return null;
  if (!mobileSrc) return <Image src={src} alt="" fill priority={priority} className={className} />;
  return (
    <>
      <Image src={mobileSrc} alt="" fill priority={priority} className={cn(className, "md:hidden")} />
      <Image src={src} alt="" fill priority={priority} className={cn(className, "hidden md:block")} />
    </>
  );
}
