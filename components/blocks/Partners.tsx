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
        <div className="relative h-[300px] w-full overflow-hidden">
          <PartnerMarquee partners={rowOne} trackClassName="h-[100px]" logoClassName="mr-10 h-8 md:h-10" />
          <PartnerMarquee
            partners={rowTwo}
            trackClassName="mt-[27px] h-[150px]"
            logoClassName="mr-16 h-14 max-w-[120px] object-contain md:mr-[100px] md:h-[90px] md:max-w-[170px]"
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
