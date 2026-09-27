import { CertificationGallery } from "@/components/about/certification-section";
import { Glow, Section, SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { mediaUrl, populated } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { Certification, CertificationsBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

const ICON_CLASS: Record<NonNullable<Certification["iconShape"]>, string> = {
  square: "h-[74px] w-[74px]",
  wide: "w-[182px]",
  narrow: "w-[73px]",
};

function CertificationCards({ block, items }: { block: Data; items: Certification[] }) {
  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionTitle eyebrow={block.header.eyebrow} title={block.header.title} desc={block.header.description} />
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-4 md:grid-cols-2",
          items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {items.map((c) => (
          <Card
            key={c.id}
            hover="lift"
            className="relative flex flex-col items-center gap-4 overflow-clip px-6 pb-8 pt-4 text-center backdrop-blur-sm"
          >
            <Glow className="-top-3.5 left-0 h-[25px] w-[322px]" />
            <div className="flex h-[98px] items-center justify-center">
              <img src={mediaUrl(c.icon)} alt="" className={ICON_CLASS[c.iconShape ?? "square"]} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="font-display text-xl font-bold leading-7 text-white">{c.title}</h3>
              {c.subtitle && (
                <span className="whitespace-nowrap rounded-full border border-accent px-3 py-1 text-xs leading-[18px] text-white backdrop-blur-sm">
                  {c.subtitle}
                </span>
              )}
              {c.description && <p className="text-sm leading-6 text-white">{c.description}</p>}
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
