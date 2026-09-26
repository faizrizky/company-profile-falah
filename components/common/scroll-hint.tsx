import { cn } from "@/lib/utils";

/** The design's three chevrons (public/home/swipe.svg), top to bottom. */
const CHEVRONS = [
  "M39.9998 8.73392L28.989 19L17.9998 8.77794L18.0342 0L28.9718 10.1508L39.9115 0.0251517L39.9998 8.73392Z",
  "M39.9998 23.7339L28.989 34L17.9998 23.7779L18.0342 15L28.9718 25.1508L39.9115 15.0252L39.9998 23.7339Z",
  "M39.9998 38.7339L28.989 49L17.9998 38.7779L18.0342 30L28.9718 40.1508L39.9115 30.0252L39.9998 38.7339Z",
];

/**
 * Scroll hint whose chevrons nudge each other downward in turn — top bumps
 * the middle, the middle bumps the bottom, the bottom drops — on a loop.
 */
export function ScrollHint({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 58 58" fill="none" className={cn("h-[58px] w-[58px] overflow-visible", className)}>
      {CHEVRONS.map((d, i) => (
        <path key={i} d={d} fill="white" className="scroll-hint__chevron" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </svg>
  );
}
