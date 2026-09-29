import { CertificationGallery } from "@/components/about/certification-section";
import { Section, SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { mediaUrl, populated } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Certification, CertificationsBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

// Mobile (Figma Mobile - Certificate_b): every logo fits a 40px-tall slot.
const ICON_CLASS: Record<NonNullable<Certification["iconShape"]>, string> = {
  square: "h-10 w-10 md:h-[74px] md:w-[74px]",
  wide: "h-10 w-auto md:h-auto md:w-[182px]",
  narrow: "h-10 w-auto md:h-auto md:w-[73px]",
};

function CertificationCards({ block, items }: { block: Data; items: Certification[] }) {
  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionTitle
        className="max-w-[682px]"
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-4 md:grid-cols-2",
          items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {items.map((c) => (
          <Card
            key={c.id}
            // Figma Card_b: no lift; hover tints the card and swaps in the colour logo.
            className="flex flex-col items-center gap-2 px-4 py-3 text-center md:gap-4 md:px-7 md:py-4"
          >
            <div className="relative flex items-center justify-center md:h-[98px] md:py-3">
              <img
                src={mediaUrl(c.icon)}
                alt=""
                className={cn(
                  ICON_CLASS[c.iconShape ?? "square"],
                  "transition-opacity duration-300",
                  mediaUrl(c.iconHover) && "group-hover:opacity-0",
                )}
              />
              {mediaUrl(c.iconHover) && (
                <img
                  src={mediaUrl(c.iconHover)}
                  alt=""
                  aria-hidden
                  className={cn(
                    ICON_CLASS[c.iconShape ?? "square"],
                    "absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  )}
                />
              )}
            </div>
            <div className="flex w-full flex-col items-center gap-1 md:gap-4">
              <h3 className="font-display text-sm font-bold leading-6 text-white md:text-xl md:leading-7">{c.title}</h3>
              {c.subtitle && (
                <span className="w-full rounded-full border border-accent px-2 py-1 text-xs leading-[18px] text-white backdrop-blur-sm md:w-auto md:whitespace-nowrap md:px-3">
                  {c.subtitle}
                </span>
              )}
              {c.description && <p className="text-xs leading-5 text-white md:text-sm md:leading-6">{c.description}</p>}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function CertificationsBlock({ block, ctx }: BlockProps<Data>) {
  const selected = populated(block.items);
  const items = selected.length > 0 ? selected : ctx.data.certifications;

  if (block.variant === "gallery") {
    return <CertificationGallery header={block.header} background={mediaUrl(block.background)} items={items} />;
  }
  return <CertificationCards block={block} items={items} />;
}
