import { cn } from "@/lib/utils";

/**
 * The design's round play button. Figma Play Button_b: the dark disc turns
 * into a light-blue one on hover.
 */
export function PlayIcon({ alt = "", className }: { alt?: string; className?: string }) {
  return (
    <span className={cn("group/play relative inline-block h-[119px] w-[119px]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static icon */}
      <img src="/home/play.svg" alt={alt} className="h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static icon */}
      <img
        src="/home/play-hover.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover/play:opacity-100"
      />
    </span>
  );
}
