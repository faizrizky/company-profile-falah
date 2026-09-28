import Image from "next/image";

import { Glow, Section, SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { mediaUrl } from "@/lib/cms/media";
import type { ExpertiseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ExpertiseBlock({ block }: BlockProps<Data>) {
  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionTitle eyebrow={block.header.eyebrow} title={block.header.title} desc={block.header.description} />

      {block.stats?.length ? (
        <div className="relative w-full">
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
                  className="font-display text-[30px] font-bold leading-5 text-accent"
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
              <Glow className="top-[200px] h-[27px] bg-blue-bright group-hover:translate-y-0 group-hover:bg-blue-bright" />
              <div className="relative h-[215px]">
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
                <div className="absolute bottom-[-20px] left-6 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-blue-bright p-5">
                  <img src={mediaUrl(e.icon)} alt="" className="h-10 w-10" />
                </div>
              </div>
              <div className="relative flex flex-col gap-4 px-6 py-10">
                <h3 className="font-display text-xl font-bold leading-6 text-white">{e.title}</h3>
                {e.description && <p className="text-sm leading-5 text-white">{e.description}</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
