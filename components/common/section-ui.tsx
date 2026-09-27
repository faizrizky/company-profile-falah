import { Fragment, type ReactNode } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/pill";

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

/**
 * The three section-title layouts in the design:
 * - home: pill always shown, 30px title (Home, solution detail pages)
 * - page: pill hidden on phones, title shrinks on phones (About, Solution)
 * - contact: like page, but left-aligned on phones (Contact page)
 */
const TITLE_STYLES = {
  home: {
    root: "max-w-[682px] items-center text-center",
    pill: "gap-1 font-medium",
    body: "flex w-full flex-col items-center gap-1",
    title: "font-display text-[30px] font-bold leading-9 text-accent",
    desc: "text-base leading-6 text-white",
  },
  page: {
    root: "items-center text-center",
    pill: "hidden md:inline-flex",
    body: null,
    title: "max-w-[900px] font-display text-[20px] font-bold leading-6 text-accent md:text-[30px] md:leading-9",
    desc: "max-w-[720px] text-sm leading-5 text-white md:text-base md:leading-6",
  },
  contact: {
    root: "items-center px-6 md:w-[772px] md:px-0",
    pill: "hidden font-medium md:inline-flex",
    body: "flex flex-col gap-4 md:gap-1 md:text-center",
    title: "font-display text-[20px] font-bold leading-6 text-accent md:text-[30px] md:leading-9",
    desc: "text-sm leading-5 text-white md:text-base md:leading-6",
  },
} as const;

/** Section heading: pill (eyebrow), title and description. */
export function SectionTitle({
  variant = "home",
  eyebrow,
  title,
  desc,
  className,
}: {
  variant?: keyof typeof TITLE_STYLES;
  eyebrow?: string | null;
  title: string;
  desc?: string | null;
  className?: string;
}) {
  const style = TITLE_STYLES[variant];
  const text = (
    <>
      <h2 className={style.title}>
        <Lines text={title} />
      </h2>
      {desc && <p className={style.desc}>{desc}</p>}
    </>
  );
  return (
    <div className={cn("flex w-full flex-col gap-3", style.root, className)}>
      {eyebrow && <Pill className={style.pill}>{eyebrow}</Pill>}
      {style.body ? <div className={style.body}>{text}</div> : text}
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
      <ResponsiveBackground src={bg} />
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
