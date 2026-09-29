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
        {/* Figma Logo Animation 2_b: 300px band; partners ~40px tall 40px apart,
            client crests 90px tall 100px apart. */}
        <div className="relative flex w-full flex-col overflow-x-clip md:-mx-20 md:h-[300px] md:w-[calc(100%+160px)]">
          <PartnerMarquee
            partners={rowOne}
            tooltip={Boolean(block.showTooltip)}
            trackClassName="h-[100px]"
            logoClassName="mr-8 h-7 max-w-[160px] md:mr-10 md:h-[40px] md:max-w-[170px]"
          />
          <PartnerMarquee
            partners={rowTwo}
            tooltip={Boolean(block.showTooltip)}
            trackClassName="mt-[27px] h-[150px]"
            logoClassName="mr-12 h-14 max-w-[120px] md:mr-[100px] md:h-[90px] md:max-w-[170px]"
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
