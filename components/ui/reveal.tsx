"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { watchVisibility } from "@/lib/visibility";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function Reveal({ children, className, delay = 0, y = 24, duration = 700, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    return watchVisibility(el, setShown, { once, threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
