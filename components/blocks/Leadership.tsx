import Image from "next/image";

import { HoverReveal } from "@/components/common/hover-reveal";
import { Glow, ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { Pill } from "@/components/ui/pill";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { LeadershipBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function LeadershipBlock({ block }: BlockProps<Data>) {
  const bg = mediaUrl(block.background);
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:h-[671px] md:px-20">
      <ResponsiveBackground src={bg} className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[708px]"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          {block.leaders?.map((leader) => {
            const photo = mediaUrl(leader.photo);
            return (
              <div key={leader.id ?? leader.name} className="group relative">
                <Glow className="z-10 -top-[9px] left-1/2 h-[25px] w-[416px] -translate-x-1/2" />
                <div
                  className={cn(
                    // Figma Leadership_b: Default at rest, Variant2 on hover.
                    "relative h-[407px] overflow-hidden rounded-lg border border-accent/50 bg-surface-dark/5 backdrop-blur-[5px] transition-[transform,background-color] duration-300 hover:scale-[1.03] hover:bg-accent/5",
                  )}
                >
                  {photo && (
                    <Image src={photo} alt={mediaAlt(leader.photo, leader.name)} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_59%,rgba(5,4,13,0.5)_93%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_100%)] p-6 backdrop-blur-[1px] transition-[backdrop-filter] duration-300 group-hover:backdrop-blur-[5px]">
                    {leader.roles?.length ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {leader.roles.map((role) => (
                          <Pill key={role} size="xs">
                            {role}
                          </Pill>
                        ))}
                      </div>
                    ) : null}
                    <h3 className="font-display text-xl font-bold leading-6 text-white">{leader.name}</h3>
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
