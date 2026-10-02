"use client";

import { useRef, useState, type ReactNode } from "react";

import { VideoControls } from "@/components/common/video-controls";
import { PlayIcon } from "@/components/ui/play-icon";

type Labels = { play: string; soundOn: string; soundOff: string; fullscreen: string; exitFullscreen: string };

type Props = {
  src: string;
  type?: string | null;
  poster?: string;
  /** Poster layer (image, gradient, caption) shown until play is pressed. */
  children: ReactNode;
  labels: Labels;
};

const centered =
  "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105";

/**
 * Click-to-play video: nothing but the poster is downloaded until the visitor
 * presses play, then the video plays in place (with sound — the tap allows
 * it) with sound and full-screen buttons. Clicking the video pauses /
 * resumes it; at the end the poster returns.
 */
export function InlineVideo({ src, type, poster, children, labels }: Props) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  if (started) {
    return (
      // The frame is what goes full screen: video and its buttons together.
      <div ref={frameRef} className="absolute inset-0 bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full cursor-pointer object-contain"
          poster={poster}
          autoPlay
          playsInline
          preload="auto"
          onClick={(e) => (e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause())}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onEnded={() => {
            if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
            setStarted(false);
          }}
        >
          <source src={src} type={type ?? undefined} />
        </video>
        {paused && (
          <button type="button" onClick={() => void videoRef.current?.play()} aria-label={labels.play} className={centered}>
            <PlayIcon />
          </button>
        )}
        <VideoControls videoRef={videoRef} frameRef={frameRef} labels={labels} className="bottom-4 right-4 md:bottom-6 md:right-6" />
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => {
          setPaused(false);
          setStarted(true);
        }}
        aria-label={labels.play}
        className={centered}
      >
        <PlayIcon />
      </button>
    </>
  );
}
