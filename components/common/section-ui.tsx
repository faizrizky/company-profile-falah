import { Fragment, type ReactNode } from "react";
import Image from "next/image";

import { Pill } from "@/components/ui/pill";
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
        // Thin glow on a card's top edge; brightens and drops a little when
        // the card (a `group`) is hovered.
        "pointer-events-none absolute -z-10 -top-[10px] left-1/2 h-[25px] w-full -translate-x-1/2 rounded-full bg-accent/75 blur-[40px] transition-all duration-300 group-hover:translate-y-[5px] group-hover:bg-accent",
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
    // Figma mobile (Mobile - Title_b): left-aligned, no pill, 20/24 title, 14/20 text.
    root: "max-w-[682px] items-start text-left md:items-center md:text-center",
    pill: "hidden gap-1 font-medium md:inline-flex",
    body: "flex w-full flex-col items-start gap-1 md:items-center",
    title: "font-display text-xl font-bold leading-6 text-accent md:text-[30px] md:leading-9",
    desc: "text-sm leading-5 text-white md:text-base md:leading-6",
  },
  page: {
    root: "items-center text-center",
    pill: "hidden font-medium md:inline-flex",
    // Figma Title_b: 12px under the pill, 4px between title and text.
    body: "flex w-full flex-col items-center gap-3 md:gap-1",
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
export function Section({ bg, className, children }: { bg?: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("relative isolate overflow-hidden px-6 py-12.5 lg:px-page", className)}>
      <ResponsiveBackground src={bg} />
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">{children}</div>
    </section>
  );
}

/** Background that swaps to a dedicated mobile image below md, when one is set. */
/**
 * Background art placed like a Figma image fill: full width, `height` and
 * `top` given as percentages of the section (e.g. "135.19%", "73.7%").
 */
export function FramedBackground({
  src,
  top,
  height,
  className,
}: {
  src?: string;
  top: string;
  height: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 -z-20", className)} style={{ top, height }}>
      <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}

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
