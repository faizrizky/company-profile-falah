"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Figma navbar "Scroll": a 2px track under the navbar whose blue bar shows
 * page-load progress. Links here are plain <a> (full page loads), so it creeps
 * forward from the click until the old page unloads, and on the new page runs
 * from where it left off to full once hydrated, then fades out.
 */
export function LoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number | null>(30);

  // Start on any same-origin link click that leads to another page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setProgress(15);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Creep towards 90% while loading.
  const loading = progress !== null && progress < 100;
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setProgress((p) => (p === null || p >= 100 ? p : p + (90 - p) * 0.1)), 200);
    return () => clearInterval(id);
  }, [loading]);

  // The page is in (first load or a client-side route change): fill, then hide.
  useEffect(() => {
    const fill = requestAnimationFrame(() => setProgress((p) => (p === null ? p : 100)));
    const hide = setTimeout(() => setProgress(null), 600);
    return () => {
      cancelAnimationFrame(fill);
      clearTimeout(hide);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="h-[2px] w-full overflow-hidden bg-surface-dark/50 backdrop-blur-[5px]">
      <div
        className={cn(
          "h-full rounded-[2px] bg-blue-bright transition-[width,opacity] duration-300 ease-out",
          progress === null ? "opacity-0" : "opacity-100",
        )}
        style={{ width: `${progress ?? 0}%` }}
      />
    </div>
  );
}
