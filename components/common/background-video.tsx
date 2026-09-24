"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

type Props = {
  src: string;
  type?: string | null;
  /** Shown before the first frame and instead of the video when motion/data is limited. */
  poster?: string;
  className?: string;
};

/** True when the visitor asked for less motion or less data. */
function prefersStill() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(connection?.saveData);
}

/**
 * Muted, looping decorative video. Loads only its metadata up front, plays
 * only while on screen, and falls back to the poster for visitors who prefer
 * reduced motion or have data saver on.
 */
const noopSubscribe = () => () => {};

export function BackgroundVideo({ src, type, poster, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // Server render: the video (with poster); the client decides after hydration.
  const still = useSyncExternalStore(noopSubscribe, prefersStill, () => false);

  useEffect(() => {
    if (still) return;
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, still]);

  if (still) {
    // eslint-disable-next-line @next/next/no-img-element -- poster is a CMS media URL
    return poster ? <img src={poster} alt="" aria-hidden className={className} /> : null;
  }

  return (
    <video
      key={src}
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} type={type ?? undefined} />
    </video>
  );
}
