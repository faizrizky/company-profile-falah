import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types/cms";

/**
 * Endless row of partner logos. Hovering a logo pauses the row, lights the
 * logo up and, when the partner has a description, shows it in a card above.
 */
export function PartnerMarquee({
  partners,
  className,
  trackClassName,
  logoClassName = "mr-[45px] h-8",
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
    // Clipped sideways only, so a logo's card can rise above the row.
    <div className={cn("overflow-x-clip", className)}>
      <div
        className={cn(
          "flex w-max items-center animate-marquee hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
          trackClassName,
        )}
      >
        {[...logos, ...logos].map((p, i) => {
          // The second copy only makes the loop seamless: hidden from screen readers.
          const copy = i >= logos.length;
          return (
            <div key={`${p.id}-${i}`} className="group/logo relative flex shrink-0" aria-hidden={copy || undefined}>
              <img
                src={mediaUrl(p.logo)}
                alt={copy ? "" : mediaAlt(p.logo, p.name)}
                className={cn(
                  "w-auto object-contain opacity-70 transition-[opacity,filter] duration-300",
                  "group-hover/logo:opacity-100 group-hover/logo:[filter:drop-shadow(0_0_8px_rgb(24_102_239/0.9))]",
                  logoClassName,
                )}
              />
              {p.description && (
                <div
                  role="tooltip"
                  className={cn(
                    "pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-[260px] -translate-x-1/2 translate-y-1",
                    "rounded-lg border border-accent/50 bg-[radial-gradient(ellipse_at_top_left,#2b3240,#1d1d22_70%)] px-5 py-4 text-center",
                    "opacity-0 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.6)] transition-[opacity,transform] duration-300",
                    "group-hover/logo:translate-y-0 group-hover/logo:opacity-100",
                  )}
                >
                  <p className="font-display text-base leading-6 text-accent">{p.name}</p>
                  <p className="text-sm leading-6 text-white">{p.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
