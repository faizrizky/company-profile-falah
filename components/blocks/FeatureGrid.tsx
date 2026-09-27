import Image from "next/image";

import { Glow, Head } from "@/components/common/section-ui";
import { mediaUrl } from "@/lib/cms/media";
import type { FeatureGridBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

type Item = NonNullable<Data["items"]>[number];

function CardsVariant({ block }: { block: Data }) {
  const bg = mediaUrl(block.background);
  return (
    <section className="relative isolate overflow-hidden px-6 pt-25 pb-12.5 md:px-20">
      {bg && <Image src={bg} alt="" fill className="-z-20 object-fill" />}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[564px]"
          pill={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {block.items?.map((card) => (
            <div
              key={card.id ?? card.title}
              className="relative flex flex-col justify-center gap-6 rounded-lg border border-accent/30 bg-surface-dark/5 p-10 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
            >
              <Glow className="-top-[7px] left-0 h-[25px] w-full" />
              <div className="flex h-[52px] items-center justify-center">
                <img src={mediaUrl(card.icon)} alt="" className="h-[50px] w-[50px]" />
              </div>
              <CardText card={card} gap="gap-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardText({ card, gap = "" }: { card: Item; gap?: string }) {
  return (
    <div className={`flex w-full flex-col text-center ${gap}`}>
      <h3 className="font-display text-lg font-bold leading-6 text-white md:text-xl">{card.title}</h3>
      {card.description && <p className="text-sm leading-5 text-white">{card.description}</p>}
    </div>
  );
}

function ValuesVariant({ block }: { block: Data }) {
  const bg = mediaUrl(block.background);
  const overlay = mediaUrl(block.backgroundOverlay);
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0A0A] px-6 py-12.5 md:bg-transparent md:px-20">
      {/* Phones (Figma mobile): a plain dark section, no background art. */}
      {bg && <Image src={bg} alt="" fill className="-z-30 hidden object-fill md:block" />}
      {overlay && <Image src={overlay} alt="" fill className="-z-20 hidden object-fill md:block" />}
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[666px] items-start text-left md:items-center md:text-center"
          pill={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="relative mx-auto flex w-full flex-col items-stretch justify-center rounded-lg backdrop-blur-[5px]">
          <Glow className="-top-[7px] left-1/2 hidden h-[25px] w-[416px] -translate-x-1/2 md:block" />
          <div className="absolute top-0 left-1/2 hidden h-[5px] w-[574px] -translate-x-1/2 bg-[#1866EF] md:block shadow-[0_0_10px_rgba(59,130,246,1)]" />
          {block.quote && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg px-4 py-8 backdrop-blur-[5px] md:h-[110px] md:flex-row md:py-0">
              <img src="/about/icon-quotes.svg" alt="" className="h-[34px] w-[34px]" />
              <p className="text-center font-display text-base font-bold leading-6 text-white md:text-xl">
                {block.quote}
              </p>
              <img src="/about/icon-quotes.svg" alt="" className="h-[34px] w-[34px]" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:px-5">
            {block.items?.map((card) => (
              <div
                key={card.id ?? card.title}
                className="flex flex-col justify-center gap-4 rounded-lg border border-accent/50 bg-surface-dark/5 p-8 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
              >
                <div className="flex h-[52px] items-center justify-center">
                  <img src={mediaUrl(card.icon)} alt="" className="h-[50px] w-[50px]" />
                </div>
                <CardText card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureGridBlock({ block }: BlockProps<Data>) {
  return block.variant === "values" ? <ValuesVariant block={block} /> : <CardsVariant block={block} />;
}
