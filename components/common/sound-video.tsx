"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { PlayIcon } from "@/components/ui/play-icon";
import { prefersStill } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { watchVisibility } from "@/lib/visibility";

type Props = {
  src: string;
  type?: string | null;
  poster?: string;
  /** Plays by itself while on screen (desktop); otherwise waits for the play button. */
  autoPlay?: boolean;
  playLabel: string;
  soundOnLabel: string;
  soundOffLabel: string;
  className?: string;
};

/**
 * Looping video with its sound on. Browsers refuse to autoplay audio before
 * the visitor has interacted with the site; then it starts muted and the
 * speaker button turns the sound on.
 */
export function SoundVideo({
  src,
  type,
  poster,
  autoPlay = false,
  playLabel,
  soundOnLabel,
  soundOffLabel,
  className,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const start = (video: HTMLVideoElement) => {
    video.muted = mutedRef.current;
    void video.play().catch(() => {
      // Sound not allowed yet: play muted instead.
      video.muted = true;
      setMuted(true);
      void video.play().catch(() => {});
    });
  };

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoPlay || prefersStill()) return;
    return watchVisibility(video, (visible) => (visible ? start(video) : video.pause()), { threshold: 0.4 });
  }, [src, autoPlay]);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    if (video.paused) start(video);
  };

  return (
    <>
      <video
        key={src}
        ref={ref}
        className={className}
        poster={poster}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={(e) => {
          if (!autoPlay) e.currentTarget.pause();
        }}
      >
        <source src={src} type={type ?? undefined} />
      </video>
      {!playing && !autoPlay && (
        <button
          type="button"
          aria-label={playLabel}
          onClick={() => {
            const video = ref.current;
            if (!video) return;
            // A tap is a user gesture: sound is allowed.
            video.muted = false;
            setMuted(false);
            void video.play();
          }}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105"
        >
          <PlayIcon />
        </button>
      )}
      {playing && (
        <button
          type="button"
          aria-label={muted ? soundOnLabel : soundOffLabel}
          aria-pressed={!muted}
          onClick={toggleSound}
          className={cn(
            "absolute bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-surface-dark/40 text-white backdrop-blur-[5px] transition-colors hover:border-accent md:bottom-12.5 md:right-20",
            muted && "animate-pulse",
          )}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </>
  );
}
