import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { HoverReveal, TagList } from "@/components/common/hover-reveal";
import { ImageLinkCard } from "@/components/common/image-link-card";
import { Section, SectionTitle } from "@/components/common/section-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { SolutionHighlightsBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function SolutionHighlightsBlock({ block }: BlockProps<Data>) {
  const { featured } = block;
  const featuredImage = mediaUrl(featured.image);

  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionTitle
        className="max-w-[574px]"
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-[329px] lg:grid-cols-3">
        <Card hover="subtle" className="relative h-[329px] md:col-span-2 md:h-full">
          <div className="relative h-full overflow-hidden rounded-lg">
            {featuredImage && (
              <Image src={featuredImage} alt={mediaAlt(featured.image)} fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 via-surface-dark/10 to-transparent" />
            <div className="relative flex h-full flex-col items-start justify-end gap-4 p-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl font-bold leading-5 text-white">{featured.title}</h3>
                {featured.description && <p className="text-xs leading-4 text-white">{featured.description}</p>}
              </div>
              {featured.tags?.length ? (
                <HoverReveal className="w-full">
                  <TagList label={featured.tagsLabel} tags={featured.tags} />
                </HoverReveal>
              ) : null}
              {featured.button?.href && (
                <Button href={featured.button.href} variant="stroke" size="md" className="w-fit">
                  {featured.button.label} <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
        {block.items?.map((c) => (
          <ImageLinkCard
            key={c.id ?? c.title}
            title={c.title}
            image={mediaUrl(c.image)}
            alt={mediaAlt(c.image, c.title)}
            href={c.href}
            description={c.description}
            tags={c.tags}
            tagsLabel={featured.tagsLabel}
            className="h-[329px] md:h-full"
          />
        ))}
      </div>
    </Section>
  );
}
