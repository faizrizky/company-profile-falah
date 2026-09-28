import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { LocaleLink } from "@/components/i18n/locale-link";
import { cn } from "@/lib/utils";

/**
 * Photo card with a title and an ↗ badge (Solution overview, home highlights).
 * With `href` the whole card is the link; without it, it's a plain card.
 */
export function ImageLinkCard({
  title,
  image,
  imageMobile,
  alt,
  href,
  largeTitle,
  className,
}: {
  title: string;
  image?: string | null;
  /** Used below md when set. */
  imageMobile?: string | null;
  alt?: string;
  href?: string | null;
  largeTitle?: boolean | null;
  /** Size and grid placement (e.g. height, md:col-span-2). */
  className?: string;
}) {
  const classes = cn(
    "group relative block h-[200px] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.03] md:h-[397px]",
    href && "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
    className,
  );
  const content = (
    <>
      {image &&
        (imageMobile ? (
          <>
            <Image src={imageMobile} alt={alt ?? title} fill className="object-cover md:hidden" />
            <Image src={image} alt={alt ?? title} fill className="hidden object-cover md:block" />
          </>
        ) : (
          <Image src={image} alt={alt ?? title} fill className="object-cover" />
        ))}
      <div className="absolute inset-0 bg-surface-dark/50 md:bg-surface-dark/25" />
      <div className="relative flex h-full flex-col items-end justify-between p-5">
        {href ? (
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white bg-surface-dark/5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-accent group-hover:bg-blue-bright"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        ) : (
          <span />
        )}
        <h3
          className={cn(
            "w-full font-display font-bold text-white",
            largeTitle ? "text-xl leading-5" : "text-base leading-5",
          )}
        >
          {title}
        </h3>
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
