"use client";

import { useEffect, useRef } from "react";

/**
 * Figma navbar "Scroll": a 2px track under the navbar whose blue bar shows how
 * far down the page the visitor has scrolled.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      // Set directly (no React render per scroll event).
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Content loading in (images, lazy sections) changes the page height.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className="h-[2px] w-full overflow-hidden bg-surface-dark/50 backdrop-blur-[5px]">
      <div
        ref={bar}
        className="h-full w-full origin-left rounded-[2px] bg-blue-bright"
        // Inline, not Tailwind's scale-x-0: that sets CSS `scale`, which would
        // multiply with this transform and keep the bar at zero width.
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
