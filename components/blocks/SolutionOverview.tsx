import { ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { SolutionOverviewTabs } from "@/components/solution/overview-tabs";
import { mediaUrl } from "@/lib/cms/media";
import type { SolutionOverviewBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function SolutionOverviewBlock({ block, ctx }: BlockProps<Data>) {
  const { categories, products } = ctx.data;
  const bg = mediaUrl(block.background);

  return (
    <section className="relative isolate overflow-hidden px-6 pb-12.5 pt-25 lg:px-20">
      <ResponsiveBackground src={bg} />
      <div className="absolute inset-0 -z-10 bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
          className="max-w-[682px]"
        />
        {/* Figma: tabs sit 16px above the card grid. */}
        <div className="flex w-full flex-col gap-4">
          <SolutionOverviewTabs categories={categories} products={products} />
        </div>
      </div>
    </section>
  );
}
