import { GlowLine } from "@/components/common/glow-line";
import { PartnerMarquee } from "@/components/common/partner-marquee";
import { SectionTitle } from "@/components/common/section-ui";
import { populated } from "@/lib/cms/media";
import type { Partner, PartnersBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function PartnersBlock({ block }: BlockProps<Data>) {
  const rowOne = populated<Partner>(block.rowOne);
  const rowTwo = populated<Partner>(block.rowTwo);

  return (
    <section className="relative isolate overflow-hidden bg-surface-dark px-6 py-12.5 md:px-20">
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[682px]"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        {/* Figma: partner logos ~120px wide, client crests 120px tall at most. */}
        <div className="relative flex w-full flex-col gap-6 overflow-x-clip pt-10">
          <PartnerMarquee
            partners={rowOne}
            trackClassName="h-[80px]"
            logoClassName="mr-10 h-6 max-w-[120px] md:mr-[60px] md:h-8"
          />
          <PartnerMarquee
            partners={rowTwo}
            trackClassName="h-[130px]"
            logoClassName="mr-12 h-12 max-w-[100px] md:mr-[80px] md:h-[72px] md:max-w-[120px]"
            reverse
          />
        </div>
      </div>
      <img src="/about/gradasi.svg" alt="" className="pointer-events-none absolute left-0 top-0 h-[600px] w-full" />
      {/* Figma: glowing ellipse on the section's bottom edge, clear of the logos. */}
      <GlowLine width="min(574px, 80%)" className="absolute bottom-0 left-1/2 -translate-x-1/2" />
    </section>
  );
}
