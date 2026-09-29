import Image from "next/image";

import { InlineVideo } from "@/components/common/inline-video";
import { Section, SectionTitle } from "@/components/common/section-ui";
import { PlayIcon } from "@/components/ui/play-icon";
import { mediaAlt, mediaType, mediaUrl } from "@/lib/cms/media";
import type { VideoShowcaseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function PlayButton({ videoUrl, label }: { videoUrl?: string | null; label: string }) {
  const icon = <PlayIcon alt={videoUrl ? "" : label} />;
  const position = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

  if (!videoUrl) return <span className={position}>{icon}</span>;
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${position} transition-transform duration-300 hover:scale-105`}
    >
      {icon}
    </a>
  );
}

export function VideoShowcaseBlock({ block, ctx }: BlockProps<Data>) {
  const poster = mediaUrl(block.poster);
  const video = mediaUrl(block.video);
  const cover = (
    <>
      {poster && <Image src={poster} alt={mediaAlt(block.poster)} fill className="object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_50%,rgba(5,4,13,1)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 px-6 py-4 md:p-10">
        {block.captionTitle && (
          <h3 className="font-display text-base font-bold leading-5 text-accent md:text-[30px] md:leading-9">
            {block.captionTitle}
          </h3>
        )}
        {block.captionDescription && (
          <p className="max-w-[860px] text-sm leading-5 text-white md:text-base md:leading-6">
            {block.captionDescription}
          </p>
        )}
      </div>
    </>
  );
  return (
    <Section bg={mediaUrl(block.background)} className="pb-0 md:pb-12.5">
      <SectionTitle
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
        className="max-w-[560px]"
      />
      {/* The poster fills the whole card, edge to edge. */}
      {/* Figma mobile: full-bleed 400px video, no frame. */}
      <div className="-mx-6 w-[calc(100%+48px)] max-w-none overflow-hidden md:mx-0 md:w-full md:max-w-[864px] md:rounded-2xl md:border md:border-accent md:shadow-[0_0_10px_rgba(147,197,253,1)]">
        <div className="relative h-[400px] overflow-hidden md:aspect-video md:h-auto">
          {video ? (
            // Uploaded video: plays in place; nothing but the poster loads until then.
            <InlineVideo src={video} type={mediaType(block.video)} poster={poster} label={ctx.t.video.play}>
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
    </Section>
  );
}
