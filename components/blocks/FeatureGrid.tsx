import { GlowLine } from "@/components/common/glow-line";
import { FramedBackground, Glow, ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { Card } from "@/components/ui/card";
import { mediaUrl } from "@/lib/cms/media";
import type { FeatureGridBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

type Item = NonNullable<Data["items"]>[number];

function CardsVariant({ block }: { block: Data }) {
  const bg = mediaUrl(block.background);
  return (
    <section className="relative isolate overflow-hidden px-6 pt-25 pb-12.5 md:px-20">
      {/* Figma: the art is anchored to the section bottom (platform rings under the cards). */}
      <ResponsiveBackground src={bg} className="-z-20 object-cover object-bottom" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[564px]"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {block.items?.map((card) => (
            <Card
              key={card.id ?? card.title}
              // Figma Card_b: no lift; hover only tints.
              className="flex flex-col justify-start gap-6 p-10"
            >
              <div className="flex h-[52px] items-center justify-center">
                <img src={mediaUrl(card.icon)} alt="" className="h-[50px] w-[50px]" />
              </div>
              <CardText card={card} gap="gap-4" />
            </Card>
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
    <section className="relative isolate overflow-hidden bg-[#0A0A0A] px-6 py-12.5 md:min-h-[650px] md:bg-transparent md:px-20">
      {/* Phones (Figma mobile): a plain dark section, no background art.
          Desktop: Figma's two image fills, framed exactly as in the design. */}
      <FramedBackground src={bg} top="73.7%" height="135.19%" className="-z-30 hidden md:block" />
      <FramedBackground src={overlay} top="-85.43%" height="159.12%" className="hidden md:block" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          className="max-w-[564px] items-start text-left md:items-center md:text-center"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <div className="relative mx-auto flex w-full flex-col items-stretch justify-center rounded-lg backdrop-blur-[5px]">
          <Glow className="z-10 -top-[7px] left-1/2 hidden h-[25px] w-[416px] -translate-x-1/2 md:block" />
          <GlowLine width={680} className="absolute left-1/2 top-0 hidden -translate-x-1/2 md:block" />
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
              <Card key={card.id ?? card.title} className="flex h-[240px] flex-col justify-center gap-4 p-8">
                <div className="flex h-[52px] items-center justify-center">
                  <img src={mediaUrl(card.icon)} alt="" className="h-[50px] w-[50px]" />
                </div>
                <CardText card={card} />
              </Card>
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
