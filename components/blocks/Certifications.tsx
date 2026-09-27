import { CertificationGallery } from "@/components/about/certification-section";
import { Glow, Section, SectionHeader } from "@/components/common/section-ui";
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
      <SectionHeader
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <div className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-2", items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
        {items.map((c) => (
          <div
            key={c.id}
            className="relative flex flex-col items-center gap-4 overflow-clip rounded-lg border border-accent/50 bg-surface-dark/5 px-6 pb-8 pt-4 text-center backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03]"
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
          </div>
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
