"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { watchVisibility } from "@/lib/visibility";

const DURATION = 1600;

function decimalsOf(value: number) {
  const s = String(value);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

/** Fast start, gentle landing. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

/**
 * Counts from 0 up to the value when scrolled into view, rising in as it
 * starts. The final text reserves the space, and digits are tabular, so the
 * number never shifts or overlaps its neighbours while counting.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = DURATION,
  delay = 0,
  className,
}: CountUpProps) {
  const decimals = decimalsOf(value);
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;
  const finalText = format(value);
  // Server render / no JS / reduced motion: just the final number.
  const [text, setText] = useState(finalText);
  const [phase, setPhase] = useState<"idle" | "waiting" | "counting" | "done">("idle");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    setPhase("waiting");
    setText(format(0));

    const start = () => {
      setPhase("counting");
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        setText(format(value * easeOutExpo(t)));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setPhase("done");
      };
      raf = requestAnimationFrame(tick);
    };

    const stopWatching = watchVisibility(
      el,
      () => {
        timer = window.setTimeout(start, delay);
      },
      { once: true, threshold: 0.4 },
    );

    return () => {
      stopWatching();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- format is derived from these
  }, [value, prefix, suffix, duration, delay, decimals]);

  return (
    <span
      ref={ref}
      className={cn("relative inline-block whitespace-nowrap tabular-nums", className)}
      aria-label={finalText}
    >
      <span aria-hidden className="invisible">
        {finalText}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 text-center transition-[opacity,transform,filter] duration-700 ease-out",
          phase === "waiting" && "translate-y-2 opacity-0 blur-[2px]",
          phase === "done" && "count-up--landed",
        )}
      >
        {text}
      </span>
    </span>
  );
}
