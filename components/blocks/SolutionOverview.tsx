import Image from "next/image";

import { SolutionOverviewTabs } from "@/components/solution/overview-tabs";
import { SectionTitle } from "@/components/common/section-ui";
import { mediaUrl } from "@/lib/cms/media";
import type { SolutionOverviewBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function SolutionOverviewBlock({ block, ctx }: BlockProps<Data>) {
  const { categories, products } = ctx.data;
  const bg = mediaUrl(block.background);

  return (
    <section className="relative isolate overflow-hidden px-6 pb-12.5 pt-25 lg:px-20">
      {bg && <Image src={bg} alt="" fill className="-z-20 object-cover" />}
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
          className="max-w-[564px]"
        />
        <SolutionOverviewTabs categories={categories} products={products} />
      </div>
    </section>
  );
}
