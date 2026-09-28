import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { HoverReveal, TagList } from "@/components/common/hover-reveal";
import { Glow } from "@/components/common/section-ui";
import { LocaleLink } from "@/components/i18n/locale-link";
import { cn } from "@/lib/utils";

/** Figma arrow hover (applied to the whole card): the photo slowly zooms in. */
const ZOOM =
  "object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.6] group-focus-visible:scale-[1.6] motion-reduce:transition-none";

/**
 * Photo card with a title and an ↗ badge (Solution overview, home highlights).
 * With `href` the whole card is the link; without it, it's a plain card.
 * On hover (Figma arrow hover, applied to the whole card) the photo zooms in,
 * the ↗ badge fills blue and `description` / `tags` slide up.
 */
export function ImageLinkCard({
  title,
  image,
  imageMobile,
  alt,
  href,
  largeTitle,
  description,
  tags,
  tagsLabel,
  tone = "highlight",
  className,
}: {
  title: string;
  image?: string | null;
  /** Used below md when set. */
  imageMobile?: string | null;
  alt?: string;
  href?: string | null;
  largeTitle?: boolean | null;
  /** Revealed on hover, under the title. */
  description?: string | null;
  tags?: string[] | null;
  /** Heading above the tags, e.g. "Recommended For". */
  tagsLabel?: string | null;
  /**
   * highlight: home Solution Highlights (bordered, glow, 50% dim).
   * product: Solution overview product (no border or glow, 25% dim, 330px tall).
   */
  tone?: "highlight" | "product";
  /** Size and grid placement (e.g. height, md:col-span-2). */
  className?: string;
}) {
  const classes = cn(
    "group relative block h-[200px] overflow-hidden rounded-lg",
    tone === "highlight" ? "border border-accent/50 bg-accent/5 backdrop-blur-[5px] md:h-[397px]" : "md:h-[330.5px]",
    href && "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
    className,
  );
  const content = (
    <>
      {image &&
        (imageMobile ? (
          <>
            <Image src={imageMobile} alt={alt ?? title} fill className={cn(ZOOM, "md:hidden")} />
            <Image src={image} alt={alt ?? title} fill className={cn(ZOOM, "hidden md:block")} />
          </>
        ) : (
          <Image src={image} alt={alt ?? title} fill className={ZOOM} />
        ))}
      {/* Figma Product_b: a constant 50% dark overlay; hover only reveals the text. */}
      <div
        className={cn(
          "absolute inset-0",
          tone === "highlight"
            ? "bg-surface-dark/50"
            : "bg-surface-dark/25 transition-colors duration-300 group-hover:bg-surface-dark/50",
        )}
      />
      {tone === "highlight" && <Glow className="z-10" />}
      <div className="relative flex h-full flex-col items-end justify-between p-5">
        {href ? (
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white bg-surface-dark/5 text-white backdrop-blur-[5px] transition-colors duration-300 group-hover:border-transparent group-hover:bg-blue-bright group-focus-visible:border-transparent group-focus-visible:bg-blue-bright"
          >
            <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
          </span>
        ) : (
          <span />
        )}
        <div className="flex w-full flex-col">
          <h3
            className={cn(
              "w-full font-display font-bold text-white",
              largeTitle && tone === "highlight" ? "text-xl leading-5" : "text-base leading-5",
            )}
          >
            {title}
          </h3>
          {(description || Boolean(tags?.length)) && (
            <HoverReveal>
              <div className="flex flex-col gap-4 pt-1">
                {description && <p className="text-xs leading-4 text-white">{description}</p>}
                <TagList label={tagsLabel} tags={tags} />
              </div>
            </HoverReveal>
          )}
        </div>
      </div>
    </>
  );

  return href ? (
    <LocaleLink href={href} className={classes} aria-label={title}>
      {content}
    </LocaleLink>
  ) : (
    <div className={classes}>{content}</div>
  );
}
