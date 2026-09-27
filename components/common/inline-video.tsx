"use client";

import { useState, type ReactNode } from "react";
import { PlayIcon } from "@/components/ui/play-icon";

type Props = {
  src: string;
  type?: string | null;
  poster?: string;
  /** Poster layer (image, gradient, caption) shown until play is pressed. */
  children: ReactNode;
  label: string;
};

const centered =
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105";

/**
 * Click-to-play video: nothing but the poster is downloaded until the visitor
 * presses play, then the video plays in place without the browser's control
 * bar. Clicking the video pauses / resumes it; at the end the poster returns.
 */
export function InlineVideo({ src, type, poster, children, label }: Props) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  if (started) {
    return (
      <>
        <video
          className="absolute inset-0 h-full w-full cursor-pointer bg-black object-contain"
          poster={poster}
          autoPlay
          playsInline
          preload="auto"
          onClick={(e) => (e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause())}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onEnded={() => setStarted(false)}
        >
          <source src={src} type={type ?? undefined} />
        </video>
        {paused && (
          <button
            type="button"
            onClick={(e) => void (e.currentTarget.previousElementSibling as HTMLVideoElement).play()}
            aria-label={label}
            className={centered}
          >
            <PlayIcon />
          </button>
        )}
      </>
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
        aria-label={label}
        className={centered}
      >
        <PlayIcon />
      </button>
    </>
  );
}
