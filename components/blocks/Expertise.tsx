import Image from "next/image";

import { Glow, Section, SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { mediaUrl } from "@/lib/cms/media";
import type { ExpertiseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ExpertiseBlock({ block }: BlockProps<Data>) {
  return (
    <Section bg={mediaUrl(block.background)} className="md:pb-12.5">
      <SectionTitle eyebrow={block.header.eyebrow} title={block.header.title} desc={block.header.description} />

      {/* Figma Mobile - Trust_b: a full-bleed 83px band where the stats glide by. */}
      {block.stats?.length ? (
        <div className="relative -mx-6 h-[83px] w-[calc(100%+48px)] overflow-hidden bg-surface-dark/5 backdrop-blur-[2px] md:hidden">
          <Glow className="-top-3 h-[25px] w-full bg-blue-bright" />
          <div className="flex h-full w-max animate-marquee items-center">
            {[...block.stats, ...block.stats].map((s, i) => (
              <div
                key={`${s.id ?? s.label}-${i}`}
                aria-hidden={i >= block.stats!.length || undefined}
                className="flex w-[320px] flex-col items-center justify-center text-center"
              >
                <span className="font-display text-2xl font-bold leading-8 tracking-[-0.48px] text-accent">
                  {s.value}
                  {s.suffix}
                </span>
                <span className="text-sm font-bold leading-6 text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {block.stats?.length ? (
        <div className="relative hidden w-full md:block">
          {/* Figma: 100px bar, 200px columns spread edge to edge, no hover state. */}
          <Card
            glow={false}
            className="grid w-full grid-cols-2 items-center gap-y-4 px-6 py-6 backdrop-blur-[2px] hover:bg-surface-dark/5 md:flex md:h-[100px] md:justify-between md:px-8"
          >
            <Glow className="-top-[13px] h-[25px] bg-blue-bright group-hover:translate-y-0 group-hover:bg-blue-bright" />
            {block.stats.map((s, i) => (
              <div
                key={s.id ?? s.label}
                className="flex flex-col items-center justify-center gap-1.5 text-center md:w-[200px]"
              >
                <CountUp
                  value={s.value}
                  suffix={s.suffix ?? ""}
                  delay={i * 80}
                  className="font-display text-[26px] font-bold leading-5 text-accent"
                />
                <span className="font-display text-base font-normal leading-5 text-white md:text-lg">{s.label}</span>
              </div>
            ))}
          </Card>
        </div>
      ) : null}

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {block.cards?.map((e) => {
          const image = mediaUrl(e.image);
          return (
            // Figma Expert Section_b: the glow sits on the photo's bottom edge and
            // tints the text area; hover zooms the photo ~5% from the top centre.
            <Card key={e.id ?? e.title} glow={false}>
              <Glow className="z-10 top-auto -bottom-px h-3 bg-blue-bright group-hover:translate-y-0 group-hover:bg-blue-bright md:top-[200px] md:bottom-auto md:h-[27px]" />
              <div className="relative h-[130px] md:h-[215px]">
                <div className="absolute inset-0 overflow-hidden">
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="origin-top object-cover transition-transform duration-500 group-hover:scale-[1.053]"
                    />
                  )}
                </div>
                <div className="absolute -bottom-[25px] left-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-bright md:bottom-[-20px] md:left-6 md:h-20 md:w-20 md:p-5">
                  <img src={mediaUrl(e.icon)} alt="" className="h-6 w-6 md:h-10 md:w-10" />
                </div>
              </div>
              <div className="relative flex flex-col gap-1 px-4 pb-3 pt-9 md:gap-4 md:px-6 md:py-10">
                <h3 className="font-display text-sm font-bold leading-6 text-white md:text-xl">{e.title}</h3>
                {e.description && <p className="text-xs leading-5 text-white md:text-sm">{e.description}</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
