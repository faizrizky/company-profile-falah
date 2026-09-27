import { cn } from "@/lib/utils";

/** The design's round play button icon. */
export function PlayIcon({ alt = "", className }: { alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- static icon
  return <img src="/home/play.svg" alt={alt} className={cn("h-[119px] w-[119px]", className)} />;
}
