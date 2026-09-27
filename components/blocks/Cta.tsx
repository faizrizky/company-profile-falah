import Image from "next/image";
import { MoveRight } from "lucide-react";

import { PlayButton } from "@/components/blocks/VideoShowcase";
import { InlineVideo } from "@/components/common/inline-video";
import { Head, ResponsiveBackground, SectionHeader } from "@/components/common/section-ui";
import { Button } from "@/components/ui/button";
import { mediaAlt, mediaType, mediaUrl } from "@/lib/cms/media";
import type { CtaBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

function WithMediaCta({ block, ctx }: BlockProps<Data>) {
  const media = mediaUrl(block.media);
  const video = mediaUrl(block.video);
  const cover = media && <Image src={media} alt={mediaAlt(block.media)} fill className="object-cover" />;
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 lg:px-20">
      <ResponsiveBackground src={mediaUrl(block.background)} mobileSrc={mediaUrl(block.backgroundMobile)} />
      <div className="absolute inset-0 -z-10 bg-black/10" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
          <SectionHeader
            eyebrow={block.header.eyebrow}
            title={block.header.title}
            desc={block.header.description}
          />
          {block.buttons?.length ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {block.buttons.map((b) => (
                <Button key={b.id ?? b.href} href={b.href} variant={b.style ?? "fill"} size="lg">
                  {b.label}
                  {(b.style ?? "fill") === "fill" && <MoveRight className="h-6 w-6" strokeWidth={1.5} />}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {(media || video) && (
          <div className="w-full max-w-[862px] overflow-hidden rounded-2xl border border-accent shadow-[0_0_10px_rgba(147,197,253,1)]">
            <div className="relative aspect-video overflow-hidden">
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
        <Head pill={block.header.eyebrow} title={block.header.title} desc={block.header.description} />
        {block.buttons?.length ? (
          <div className="flex w-full flex-col gap-3 md:w-fit md:flex-row">
            {block.buttons.map((b) => (
              <Button
                key={b.id ?? b.href}
                href={b.href}
                variant={b.style ?? "fill"}
                size="lg"
                className="w-full md:w-fit"
              >
                {b.label}
                {(b.style ?? "fill") === "fill" && <img src="/about/icon-arrow.svg" alt="" className="h-6 w-6" />}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function CtaBlock({ block, ctx }: BlockProps<Data>) {
  return block.variant === "withMedia" ? <WithMediaCta block={block} ctx={ctx} /> : <SimpleCta block={block} />;
}
