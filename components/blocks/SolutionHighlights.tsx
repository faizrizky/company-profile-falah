import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Glow, Section, SectionHeader } from "@/components/common/section-ui";
import { Button } from "@/components/ui/button";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { SolutionHighlightsBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function SolutionHighlightsBlock({ block }: BlockProps<Data>) {
  const { featured } = block;
  const featuredImage = mediaUrl(featured.image);

  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionHeader
        className="max-w-[574px]"
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[329px] lg:grid-cols-3">
        <div className="relative h-[329px] rounded-lg border border-accent/50 bg-surface-dark/5 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.02] md:col-span-2 md:h-full">
          <Glow className="-top-[9px] left-0 h-[25px] w-[416px]" />
          <div className="relative h-full overflow-hidden rounded-lg">
            {featuredImage && (
              <Image src={featuredImage} alt={mediaAlt(featured.image)} fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 via-surface-dark/10 to-transparent" />
            <div className="relative flex h-full flex-col items-start justify-end gap-4 p-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl font-bold leading-5 text-white">{featured.title}</h3>
                {featured.description && (
                  <p className="text-xs leading-4 text-white">{featured.description}</p>
                )}
              </div>
              {featured.tags?.length ? (
                <div className="flex flex-col gap-1 self-start">
                  {featured.tagsLabel && (
                    <span className="text-xs font-medium leading-4 text-white">{featured.tagsLabel}</span>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {featured.tags.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white bg-surface-dark/5 px-2 py-1 text-xs leading-4 text-white backdrop-blur-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {featured.button?.href && (
                <Button href={featured.button.href} variant="stroke" size="md" className="w-fit">
                  {featured.button.label} <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        {block.items?.map((c) => {
          const image = mediaUrl(c.image);
          return (
            <div
              key={c.id ?? c.title}
              className="relative h-[329px] rounded-lg border border-accent/50 bg-accent/5 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.02] md:h-full"
            >
              <Glow className="-top-[9px] left-0 h-[25px] w-[416px]" />
              <div className="relative h-full overflow-hidden rounded-lg">
                {image && <Image src={image} alt={mediaAlt(c.image)} fill className="object-cover" />}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex h-full flex-col items-end justify-between p-5">
                  <Button href={c.href} variant="stroke" size="md" ariaLabel={c.title} className="w-10 px-0">
                    <ArrowUpRight className="h-6 w-6" />
                  </Button>
                  <h3 className="w-full font-display text-base font-bold leading-5 text-white">{c.title}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
