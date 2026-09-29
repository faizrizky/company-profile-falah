import Image from "next/image";

import { PlayButton } from "@/components/blocks/VideoShowcase";
import { InlineVideo } from "@/components/common/inline-video";
import { ResponsiveBackground, SectionTitle } from "@/components/common/section-ui";
import { CmsButtons } from "@/components/ui/cms-buttons";
import { mediaAlt, mediaType, mediaUrl } from "@/lib/cms/media";
import type { CtaBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

function WithMediaCta({ block, ctx }: BlockProps<Data>) {
  const media = mediaUrl(block.media);
  const video = mediaUrl(block.video);
  const cover = media && <Image src={media} alt={mediaAlt(block.media)} fill className="object-cover" />;
  return (
    <section className="relative isolate overflow-hidden px-6 pt-12.5 md:pb-12.5 lg:px-20">
      <ResponsiveBackground src={mediaUrl(block.background)} mobileSrc={mediaUrl(block.backgroundMobile)} />
      <div className="absolute inset-0 -z-10 bg-black/10" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
          <SectionTitle eyebrow={block.header.eyebrow} title={block.header.title} desc={block.header.description} />
          <CmsButtons
            buttons={block.buttons}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center"
            buttonClassName="w-full sm:w-fit"
          />
        </div>
        {(media || video) && (
          // Figma mobile Compro Video: full-bleed 400px, no frame.
          <div className="-mx-6 w-[calc(100%+48px)] max-w-none overflow-hidden md:mx-0 md:w-full md:max-w-[862px] md:rounded-2xl md:border md:border-accent md:shadow-[0_0_10px_rgba(147,197,253,1)]">
            <div className="relative h-[400px] overflow-hidden md:aspect-video md:h-auto">
              {video ? (
                <InlineVideo src={video} type={mediaType(block.video)} poster={media} label={ctx.t.video.play}>
                  {cover}
                </InlineVideo>
              ) : (
                <>
                  {cover}
                  <PlayButton videoUrl={block.videoUrl} label={ctx.t.video.play} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SimpleCta({ block }: { block: Data }) {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      <ResponsiveBackground src={mediaUrl(block.background)} mobileSrc={mediaUrl(block.backgroundMobile)} />
      <div className="relative mx-auto flex w-full max-w-[800px] flex-col items-center gap-8">
        <SectionTitle
          variant="page"
          eyebrow={block.header.eyebrow}
          title={block.header.title}
          desc={block.header.description}
        />
        <CmsButtons
          buttons={block.buttons}
          className="flex w-full flex-col gap-3 md:w-fit md:flex-row md:flex-wrap"
          buttonClassName="w-full md:w-fit"
          arrow={<img src="/about/icon-arrow.svg" alt="" className="h-6 w-6" />}
        />
      </div>
    </section>
  );
}

export function CtaBlock({ block, ctx }: BlockProps<Data>) {
  return block.variant === "withMedia" ? <WithMediaCta block={block} ctx={ctx} /> : <SimpleCta block={block} />;
}
