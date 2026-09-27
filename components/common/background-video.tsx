"use client";

import { useEffect, useRef } from "react";

import { useIsMobile, usePrefersStill } from "@/lib/use-media";
import { watchVisibility } from "@/lib/visibility";

type Props = {
  src: string;
  type?: string | null;
  /** Lighter file for phones (e.g. 720p); falls back to `src`. */
  mobileSrc?: string;
  mobileType?: string | null;
  /** Shown before the first frame and instead of the video when motion/data is limited. */
  poster?: string;
  className?: string;
};

/**
 * Muted, looping decorative video. Loads only its metadata up front, plays
 * only while on screen, and falls back to the poster for visitors who prefer
 * reduced motion or have data saver on.
 */
export function BackgroundVideo({ src, type, mobileSrc, mobileType, poster, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // Server render: the video (with poster); the client decides after hydration.
  const still = usePrefersStill();
  // Unknown on the server: nothing is fetched until the client picks a file.
  const mobile = useIsMobile();
  const usesMobile = Boolean(mobile && mobileSrc);
  const file = usesMobile ? mobileSrc! : src;
  const fileType = usesMobile ? mobileType : type;

  useEffect(() => {
    if (still) return;
    const video = ref.current;
    if (!video) return;
    return watchVisibility(
      video,
      (visible) => (visible ? void video.play().catch(() => {}) : video.pause()),
      { threshold: 0.15 },
    );
  }, [file, still, mobile]);

  if (still || (mobile === null && mobileSrc)) {
    // eslint-disable-next-line @next/next/no-img-element -- poster is a CMS media URL
    return poster ? <img src={poster} alt="" aria-hidden className={className} /> : null;
  }

  return (
    <video
      key={file}
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
      <source src={file} type={fileType ?? undefined} />
    </video>
  );
}
