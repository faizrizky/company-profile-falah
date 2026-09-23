import Image from "next/image";

import { Section, SectionHeader } from "@/components/common/section-ui";
import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { VideoShowcaseBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function PlayButton({ videoUrl, label }: { videoUrl?: string | null; label: string }) {
  const icon = (
    <img
      src="/home/play.svg"
      alt={videoUrl ? "" : label}
      className="h-[119px] w-[119px]"
    />
  );
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
  return (
    <Section bg={mediaUrl(block.background)} className="py-25">
      <SectionHeader
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <div className="w-full max-w-[942px] rounded-2xl border border-accent p-10 shadow-[0_0_10px_rgba(147,197,253,1)]">
        <div className="relative aspect-video overflow-hidden">
          {poster && <Image src={poster} alt={mediaAlt(block.poster)} fill className="object-cover" />}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_50%,rgba(5,4,13,1)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-1 p-10">
            {block.captionTitle && (
              <h3 className="font-display text-xl font-bold leading-6 text-white">{block.captionTitle}</h3>
            )}
            {block.captionDescription && (
              <p className="text-sm leading-5 text-white">{block.captionDescription}</p>
            )}
          </div>
          <PlayButton videoUrl={block.videoUrl} label={ctx.t.video.play} />
        </div>
      </div>
    </Section>
  );
}
