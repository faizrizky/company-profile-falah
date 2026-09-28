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

export function SolutionHighlightsBlock({ block, ctx }: BlockProps<Data>) {
  const { featured } = block;
  // Label above every card's tags; the site's own wording when the CMS leaves it empty.
  const tagsLabel = featured.tagsLabel || ctx.t.solutions.recommendedFor;
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
        <Card className="h-[329px] md:col-span-2 md:h-full">
          <div className="relative h-full overflow-hidden rounded-lg">
            {featuredImage && (
              <Image src={featuredImage} alt={mediaAlt(featured.image)} fill className="object-cover" />
            )}
            {/* Figma Product - Virtual Training Suite_b: light blue wash over the photo. */}
            <div className="absolute inset-0 bg-accent/25" />
            <div className="relative flex h-full flex-col items-start justify-end p-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl font-bold leading-5 text-white">{featured.title}</h3>
                {featured.description && <p className="text-xs leading-4 text-white">{featured.description}</p>}
              </div>
              {featured.tags?.length ? (
                <HoverReveal className="w-full">
                  <TagList label={tagsLabel} tags={featured.tags} className="gap-1 pt-4" />
                </HoverReveal>
              ) : null}
              {featured.button?.href && (
                <Button href={featured.button.href} variant="stroke" size="md" className="mt-4 w-fit px-4 font-normal">
                  {featured.button.label} <ArrowUpRight className="h-6 w-6" strokeWidth={1.5} />
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
            tagsLabel={tagsLabel}
            className="h-[329px] md:h-full"
          />
        ))}
      </div>
    </Section>
  );
}
