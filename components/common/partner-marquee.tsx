import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types/cms";

export function PartnerMarquee({
  partners,
  className,
  trackClassName,
  logoClassName = "mr-[45px] h-8 opacity-70",
  reverse,
}: {
  partners: Partner[];
  className?: string;
  trackClassName?: string;
  /** Size and spacing of each logo. */
  logoClassName?: string;
  reverse?: boolean;
}) {
  const logos = partners.filter((p) => mediaUrl(p.logo));
  if (logos.length === 0) return null;

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-center animate-marquee",
          reverse && "[animation-direction:reverse]",
          trackClassName,
        )}
      >
        {[...logos, ...logos].map((p, i) => {
          // The second copy only makes the loop seamless: hidden from screen readers and tabbing.
          const copy = i >= logos.length;
          const logo = (
            <img
              src={mediaUrl(p.logo)}
              alt={copy ? "" : mediaAlt(p.logo, p.name)}
              aria-hidden={copy || undefined}
              className={cn("w-auto", logoClassName, p.website && "transition-opacity hover:opacity-100")}
            />
          );
          return p.website ? (
            <a
              key={`${p.id}-${i}`}
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              title={p.name}
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
              className="flex shrink-0"
            >
              {logo}
            </a>
          ) : (
            <span key={`${p.id}-${i}`} className="contents">
              {logo}
            </span>
          );
        })}
      </div>
    </div>
  );
}
