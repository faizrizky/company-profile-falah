import Image from "next/image";

import { Glow, Section, SectionHeader } from "@/components/common/section-ui";
import { CountUp } from "@/components/ui/count-up";
import { mediaUrl } from "@/lib/cms/media";
import type { ExpertiseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ExpertiseBlock({ block }: BlockProps<Data>) {
  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionHeader
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />

      {block.stats?.length ? (
        <div className="relative w-full">
          <Glow className="-top-3 left-0 h-[25px] w-full" />
          <div className="grid min-h-[100px] w-full grid-cols-2 items-center rounded-lg border border-accent/50 bg-surface-dark/20 px-6 py-5 backdrop-blur-sm md:grid-cols-4 md:px-10">
            {block.stats.map((s, i) => (
              <div key={s.id ?? s.label} className="flex flex-col items-center justify-center gap-2 text-center">
                <CountUp
                  value={s.value}
                  suffix={s.suffix ?? ""}
                  delay={i * 80}
                  className="font-display text-3xl font-bold leading-none text-accent"
                />
                <span className="text-sm font-semibold leading-5 text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {block.cards?.map((e) => {
          const image = mediaUrl(e.image);
          return (
            <div
              key={e.id ?? e.title}
              className="relative overflow-hidden rounded-lg border border-accent/50 bg-surface-dark/20 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03]"
            >
              <div className="relative h-[160px]">
                <div className="absolute inset-0 overflow-hidden">
                  {image && <Image src={image} alt="" fill className="object-cover" />}
                  <div className="absolute inset-0 bg-surface-dark/20" />
                </div>
                <div className="absolute bottom-[-28px] left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-blue-bright p-3 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                  <img src={mediaUrl(e.icon)} alt="" className="h-8 w-8" />
                </div>
              </div>
              <div className="relative min-h-[140px] bg-[linear-gradient(180deg,rgba(15,42,100,0.95)_0%,rgba(5,15,40,0.95)_100%)] px-4 pb-6 pt-7">
                <h3 className="font-display text-base font-bold leading-6 text-accent">{e.title}</h3>
                {e.description && <p className="mt-5 text-sm leading-5 text-white">{e.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
