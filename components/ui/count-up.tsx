"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DURATION = 1100;
const SCRAMBLE_SHARE = 0.7;
const RANDOM_STEP = 50;

function decimalsOf(value: number) {
  const s = String(value);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = DURATION,
  delay = 0,
  className,
}: CountUpProps) {
  const decimals = decimalsOf(value);
  const finalText = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const [text, setText] = useState(finalText);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    let lastRandom = 0;

    const start = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const elapsed = now - t0;
        if (elapsed >= duration) {
          setText(finalText);
          return;
        }
        const t = elapsed / duration;
        const chance = t < SCRAMBLE_SHARE ? 1 : (1 - t) / (1 - SCRAMBLE_SHARE);
        if (Math.random() < chance) {
          if (now - lastRandom >= RANDOM_STEP) {
            lastRandom = now;
            const random = (Math.random() * Math.max(value, 99)).toFixed(decimals);
            setText(`${prefix}${random}${suffix}`);
          }
        } else {
          setText(finalText);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(start, delay);
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration, delay, finalText, decimals]);

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span aria-hidden className="invisible">
        {finalText}
      </span>
      <span className="absolute inset-0 text-center">{text}</span>
    </span>
  );
}
