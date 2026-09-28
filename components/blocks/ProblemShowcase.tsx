import { Lines, ResponsiveBackground } from "@/components/common/section-ui";
import { ProblemTabs } from "@/components/home/problem-tabs";
import { Pill } from "@/components/ui/pill";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { ProblemShowcaseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ProblemShowcaseBlock({ block }: BlockProps<Data>) {
  const { header } = block;
  const bg = mediaUrl(block.background);
  const image = mediaUrl(block.image);

  return (
    <section className="relative isolate overflow-hidden px-6 pt-12.5 lg:px-20 lg:pt-25 lg:pb-12">
      <ResponsiveBackground src={bg} />
      <div className="absolute inset-0 -z-10 bg-[#0A0A0A] lg:bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[564px] flex-col items-center gap-3 text-center">
          {header.eyebrow && <Pill className="hidden gap-1 lg:inline-flex">{header.eyebrow}</Pill>}
          <h2 className="max-w-[900px] font-display text-[30px] font-bold leading-9 text-accent">
            <Lines text={header.title} />
          </h2>
          {header.description && <p className="max-w-[720px] text-base leading-6 text-white">{header.description}</p>}
        </div>
        <ProblemTabs
          items={(block.items ?? []).map((p, i) => ({
            key: p.id ?? `${i}`,
            icon: mediaUrl(p.icon),
            title: p.title,
            description: p.description,
            image: mediaUrl(p.image),
            alt: mediaAlt(p.image, p.title),
          }))}
          fallbackImage={image}
          fallbackAlt={mediaAlt(block.image)}
        />
      </div>
    </section>
  );
}
