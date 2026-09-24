"use client";

import { useState, type ReactNode } from "react";

type Props = {
  src: string;
  type?: string | null;
  poster?: string;
  /** Poster layer (image, gradient, caption) shown until play is pressed. */
  children: ReactNode;
  label: string;
};

/**
 * Click-to-play video: nothing but the poster is downloaded until the visitor
 * presses play, then the video loads and plays in place with controls.
 */
export function InlineVideo({ src, type, poster, children, label }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        className="absolute inset-0 h-full w-full bg-black object-contain"
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="auto"
      >
        <source src={src} type={type ?? undefined} />
      </video>
    );
  }

  return (
    <>
      {children}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={label}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static icon */}
        <img src="/home/play.svg" alt="" className="h-[119px] w-[119px]" />
      </button>
    </>
  );
}
