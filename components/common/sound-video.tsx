"use client";

import { useEffect, useRef, useState } from "react";
import { VideoControls } from "@/components/common/video-controls";
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
  fullscreenLabel: string;
  exitFullscreenLabel: string;
  className?: string;
  /** Where the sound / full-screen buttons sit. */
  controlsClassName?: string;
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
  fullscreenLabel,
  exitFullscreenLabel,
  className,
  controlsClassName = "bottom-6 right-6 md:bottom-12.5 md:right-20",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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

  // Keep `muted` in step with the sound button (it toggles the video directly).
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const sync = () => setMuted(video.muted);
    video.addEventListener("volumechange", sync);
    return () => video.removeEventListener("volumechange", sync);
  }, [src]);

  return (
    // The frame is what goes full screen: video and its buttons together.
    <div ref={frameRef} className="absolute inset-0">
      <video
        key={src}
        ref={ref}
        // Full screen shows the whole picture instead of cropping it.
        className={cn(className, "[:fullscreen_&]:object-contain")}
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
        <VideoControls
          videoRef={ref}
          frameRef={frameRef}
          labels={{
            soundOn: soundOnLabel,
            soundOff: soundOffLabel,
            fullscreen: fullscreenLabel,
            exitFullscreen: exitFullscreenLabel,
          }}
          className={controlsClassName}
        />
      )}
    </div>
  );
}
