import Image from "next/image";

import { Glow, SectionTitle } from "@/components/common/section-ui";
import { CountUp } from "@/components/ui/count-up";
import { mediaUrl } from "@/lib/cms/media";
import type { TeamStatsBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function TeamStatsBlock({ block }: BlockProps<Data>) {
  const bg = mediaUrl(block.background);
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      {bg && <Image src={bg} alt="" fill className="-z-20 object-fill" />}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[682px]"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {block.items?.map((item, i) => (
            <div
              key={item.id ?? item.label}
              className="relative flex flex-col items-start gap-5 overflow-clip rounded-lg border border-accent/50 bg-surface-dark/5 p-10 backdrop-blur-[5px]"
            >
              <Glow className="-top-[15px] left-1/2 h-[25px] w-[356px] -translate-x-1/2" />
              {/* Two lines reserved, so every number sits on the same line. */}
              <h3 className="min-h-[60px] font-display text-2xl font-bold leading-[30px] text-white">{item.label}</h3>
              <div className="flex h-[34px] flex-col justify-center">
                <CountUp
                  value={item.value}
                  suffix={item.suffix ?? ""}
                  delay={i * 80}
                  className="font-display text-[48px] font-bold leading-6 text-[#1866EF]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
