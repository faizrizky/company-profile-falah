import Image from "next/image";

import { Glow, Lines, ResponsiveBackground } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import { cn } from "@/lib/utils";
import type { ProblemShowcaseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function ProblemShowcaseBlock({ block }: BlockProps<Data>) {
  const { header } = block;
  const bg = mediaUrl(block.background);
  const image = mediaUrl(block.image);

  return (
    <section className="relative isolate overflow-hidden px-6 pt-12.5 lg:px-20 lg:pt-25 lg:pb-12">
      <ResponsiveBackground src={bg} />
      <div className="absolute inset-0 -z-10 bg-[#0A0A0A] lg:bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[564px] flex-col items-center gap-3 text-center">
          {header.eyebrow && <Pill className="hidden gap-1 lg:inline-flex">{header.eyebrow}</Pill>}
          <h2 className="max-w-[900px] font-display text-[30px] font-bold leading-9 text-accent">
            <Lines text={header.title} />
          </h2>
          {header.description && <p className="max-w-[720px] text-base leading-6 text-white">{header.description}</p>}
        </div>
        <div className="grid w-full grid-cols-1 gap-4 lg:h-[530px] lg:grid-cols-[600px_1fr]">
          <div className="flex flex-col gap-4">
            {block.items?.map((p) => (
              <div
                key={p.id ?? p.title}
                className={cn(
                  "group relative flex flex-col justify-center overflow-clip rounded-lg border border-accent/50 p-7 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.02] lg:flex-1",
                  p.description ? "bg-accent/15" : "bg-surface-dark/5",
                )}
              >
                <Glow className="-top-[7px] left-1/2 h-[15px] w-[416px] -translate-x-1/2" />
                <div className="flex items-center gap-[31px]">
                  {/* Figma icons carry their own glow, drawn around a 28px glyph. */}
                  <img src={mediaUrl(p.icon)} alt="" className="-m-1 h-[37px] w-9 shrink-0 object-contain" />
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-display text-xl font-bold leading-6 text-white">{p.title}</h3>
                    {p.description && <p className="text-base font-medium leading-5 text-white">{p.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <Card surface="none" className="relative h-full min-h-[300px] overflow-hidden lg:min-h-0">
              {image && <Image src={image} alt={mediaAlt(block.image)} fill className="object-cover" />}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
