import Image from "next/image";

import { HoverReveal } from "@/components/common/hover-reveal";
import { FramedBackground, Glow, SectionTitle } from "@/components/common/section-ui";
import { Pill } from "@/components/ui/pill";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { LeadershipBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function LeadershipBlock({ block }: BlockProps<Data>) {
  const bg = mediaUrl(block.background);
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:h-[671px] md:px-page">
      {/* Figma image fill: 123.7% tall, shifted up 23.66%. */}
      <FramedBackground src={bg} top="-23.66%" height="123.7%" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[564px]"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          {block.leaders?.map((leader) => {
            const photo = mediaUrl(leader.photo);
            return (
              <div key={leader.id ?? leader.name} className="group relative">
                <div
                  className={cn(
                    // Figma Leadership_b: Default at rest, Variant2 on hover.
                    "relative h-[407px] overflow-hidden rounded-lg border border-accent/50 bg-surface-dark/5 backdrop-blur-[5px] transition-colors duration-300 hover:bg-accent/5",
                  )}
                >
                  {/* Figma Leadership_b: glow inside the card, clipped by its edges, over the photo. */}
                  <Glow className="z-10 -top-[10px] group-hover:translate-y-0 group-hover:bg-accent/75" />
                  {photo && (
                    <Image src={photo} alt={mediaAlt(leader.photo, leader.name)} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_59%,rgba(5,4,13,0.5)_93%)]" />
                  <div className="absolute inset-x-0 bottom-0 isolate flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_100%)] p-6">
                    {/* Figma Isi blur (1px → 5px on hover), feathered at the top so it has no hard edge. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 -z-10 backdrop-blur-[1px] transition-[backdrop-filter] duration-300 [mask-image:linear-gradient(to_bottom,transparent,black_35%)] group-hover:backdrop-blur-[5px]"
                    />
                    {leader.roles?.length ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {leader.roles.map((role) => (
                          <Pill key={role} size="xs">
                            {role}
                          </Pill>
                        ))}
                      </div>
                    ) : null}
                    <h3 className="font-display text-xl font-bold leading-7 text-white">{leader.name}</h3>
                    {leader.bio && (
                      <HoverReveal>
                        <p className="text-xs leading-5 text-white">{leader.bio}</p>
                      </HoverReveal>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
