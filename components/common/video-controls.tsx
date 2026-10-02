"use client";

import { type RefObject, useEffect, useState } from "react";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

type LockableOrientation = ScreenOrientation & { lock?: (orientation: string) => Promise<void> };

const BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-surface-dark/40 text-white backdrop-blur-[5px] transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** On a phone (touch screen), full screen also turns the video sideways. */
const isPhone = () => window.matchMedia("(pointer: coarse)").matches;

/**
 * Sound and full-screen buttons for a playing video. Full screen covers the
 * video's frame (so its own controls stay usable); on phones it also locks the
 * screen to landscape where the browser allows it (Android). iPhones can't
 * full-screen a page element or lock the orientation from a website, so there
 * the video opens in the system player, which follows the phone's rotation.
 */
export function VideoControls({
  videoRef,
  frameRef,
  labels,
  className,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** The element shown full screen (the video's frame). */
  frameRef: RefObject<HTMLElement | null>;
  labels: { soundOn: string; soundOff: string; fullscreen: string; exitFullscreen: string };
  className?: string;
}) {
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Follow the video's real state (it may start muted when the browser refuses sound).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => setMuted(video.muted);
    sync();
    video.addEventListener("volumechange", sync);
    return () => video.removeEventListener("volumechange", sync);
  }, [videoRef]);

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === frameRef.current;
      setFullscreen(on);
      if (!on) {
        try {
          screen.orientation?.unlock?.();
        } catch {
          // Nothing to unlock.
        }
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [frameRef]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (video.paused) void video.play().catch(() => {});
  };

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    const video = videoRef.current as WebkitVideo | null;
    if (!frame || !video) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (frame.requestFullscreen) {
      try {
        await frame.requestFullscreen({ navigationUI: "hide" });
        if (isPhone()) await (screen.orientation as LockableOrientation)?.lock?.("landscape").catch(() => {});
        return;
      } catch {
        // Fall through to the video's own full screen.
      }
    }
    // iPhone Safari: only the video element itself can go full screen.
    video.webkitEnterFullscreen?.();
  };

  return (
    <div className={cn("absolute z-20 flex gap-2", className)}>
      <button
        type="button"
        aria-label={muted ? labels.soundOn : labels.soundOff}
        aria-pressed={!muted}
        onClick={toggleSound}
        className={cn(BUTTON, muted && "animate-pulse")}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      <button
        type="button"
        aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
        aria-pressed={fullscreen}
        onClick={() => void toggleFullscreen()}
        className={BUTTON}
      >
        {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </button>
    </div>
  );
}
