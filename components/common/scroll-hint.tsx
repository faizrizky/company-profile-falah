import { cn } from "@/lib/utils";

/**
 * Three stacked chevrons that nudge each other downward in turn — top bumps
 * the middle, the middle bumps the bottom, the bottom drops — on a loop.
 */
export function ScrollHint({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex h-[58px] w-[58px] flex-col items-center justify-center", className)}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 14"
          className="scroll-hint__chevron -my-[3px] h-[17px] w-[26px] text-[#c9c9cf]"
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          <path d="M0 0h7l5 5 5-5h7L12 12z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
