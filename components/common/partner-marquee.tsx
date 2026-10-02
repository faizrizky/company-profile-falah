import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types/cms";

/** Width × height giving a logo the target area, kept inside the max box. */
function balancedSize(
  partner: Partner,
  { area, maxWidth, maxHeight }: { area: number; maxWidth: number; maxHeight: number },
) {
  const logo = typeof partner.logo === "object" ? partner.logo : null;
  const ratio = logo?.width && logo?.height ? logo.width / logo.height : 3;
  let height = Math.sqrt(area / ratio);
  let width = height * ratio;
  if (width > maxWidth) [width, height] = [maxWidth, maxWidth / ratio];
  if (height > maxHeight) [width, height] = [maxHeight * ratio, maxHeight];
  return {
    width: `calc(var(--logo-scale, 1) * ${width.toFixed(1)}px)`,
    height: `calc(var(--logo-scale, 1) * ${height.toFixed(1)}px)`,
  };
}

/**
 * Endless row of partner logos. Hovering a logo pauses the row and swaps in
 * the partner's original colour logo (Figma Variant2); with `tooltip`, a
 * partner's description shows in a card right above it (Figma Logo_b Detail).
 */
export function PartnerMarquee({
  partners,
  className,
  trackClassName,
  logoClassName = "mr-[45px] h-8",
  reverse,
  tooltip = false,
  balance,
}: {
  partners: Partner[];
  className?: string;
  trackClassName?: string;
  /** Size and spacing of each logo. */
  logoClassName?: string;
  reverse?: boolean;
  /** Show the description card on hover (CMS setting; home hero only by default). */
  tooltip?: boolean;
  /**
   * Gives every logo about the same visual weight (Figma Logo_b): each is
   * sized from its own proportions to cover `area` px², within `maxWidth` ×
   * `maxHeight` — long wordmarks (PLATH) get shorter, round crests larger.
   * Scaled on phones by `--logo-scale` (set on the track).
   */
  balance?: { area: number; maxWidth: number; maxHeight: number };
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
            <div key={`${p.id}-${i}`} className="group/logo flex shrink-0" aria-hidden={copy || undefined}>
              {/* Size and spacing sit on this box, so the card centres on the logo itself. */}
              <span
                className={cn("relative flex items-center justify-center", logoClassName)}
                style={balance ? balancedSize(p, balance) : undefined}
              >
                <img
                  src={mediaUrl(p.logo)}
                  alt={copy ? "" : mediaAlt(p.logo, p.name)}
                  className={cn(
                    "h-full w-auto max-w-full object-contain transition-opacity duration-300",
                    mediaUrl(p.logoHover) ? "group-hover/logo:opacity-0" : "opacity-70 group-hover/logo:opacity-100",
                  )}
                />
                {mediaUrl(p.logoHover) && (
                  <img
                    src={mediaUrl(p.logoHover)}
                    alt=""
                    aria-hidden
                    // A faint light-blue glow on the colour logo.
                    className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 [filter:drop-shadow(0_0_4px_rgb(147_197_253/0.35))] group-hover/logo:opacity-100"
                  />
                )}
                {tooltip && p.description && (
                  <span
                    role="tooltip"
                    className={cn(
                      // Figma Detail: 173px card, 16px padding, right above the logo.
                      "pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 flex w-[173px] -translate-x-1/2 translate-y-1 flex-col items-center overflow-clip",
                      "rounded-lg border border-accent/50 bg-surface-dark/50 p-4 text-center backdrop-blur-[5px]",
                      "opacity-0 transition-[opacity,transform] duration-300",
                      "group-hover/logo:translate-y-0 group-hover/logo:opacity-100",
                    )}
                  >
                    <span aria-hidden className="absolute -top-[9px] left-0 h-[15px] w-[138px] rounded-full bg-accent/60 blur-[40px]" />
                    <span className="relative font-display text-sm leading-5 text-accent">{p.name}</span>
                    <span className="relative text-xs leading-5 text-white">{p.description}</span>
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
