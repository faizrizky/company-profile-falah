import { PartnerMarquee } from "@/components/common/partner-marquee";
import { Head } from "@/components/common/section-ui";
import { populated } from "@/lib/cms/media";
import type { Partner, PartnersBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function PartnersBlock({ block }: BlockProps<Data>) {
  const rowOne = populated<Partner>(block.rowOne);
  const rowTwo = populated<Partner>(block.rowTwo);

  return (
    <section className="relative isolate overflow-hidden bg-surface-dark px-6 py-12.5 md:px-20">
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[682px]"
          pill={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="relative h-[300px] w-full overflow-hidden">
          <PartnerMarquee partners={rowOne} trackClassName="h-[100px]" />
          <PartnerMarquee partners={rowTwo} trackClassName="mt-[27px] h-[173px]" reverse />
          <div className="absolute bottom-[50px] left-1/2 h-[5px] w-[574px] -translate-x-1/2 bg-[#1866EF] shadow-[0_0_10px_rgba(59,130,246,1)]" />
        </div>
      </div>
      <img src="/about/gradasi.svg" alt="" className="pointer-events-none absolute left-0 top-0 h-[600px] w-full" />
    </section>
  );
}
