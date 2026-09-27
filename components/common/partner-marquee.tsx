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
        {[...logos, ...logos].map((p, i) => (
          <img
            key={`${p.id}-${i}`}
            src={mediaUrl(p.logo)}
            alt={i < logos.length ? mediaAlt(p.logo, p.name) : ""}
            aria-hidden={i >= logos.length || undefined}
            className={cn("w-auto", logoClassName)}
          />
        ))}
      </div>
    </div>
  );
}
