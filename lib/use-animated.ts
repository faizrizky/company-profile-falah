"use client";

import { useEffect, useRef, useState } from "react";

export function useDelayedUnmount(open: boolean, ms = 250) {
  const [rendered, setRendered] = useState(open);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (open) {
      setRendered(true);
      return;
    }
    timer.current = window.setTimeout(() => setRendered(false), ms);
    return () => window.clearTimeout(timer.current);
  }, [open, ms]);

  return rendered;
}

export function useModalEffects(open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
}
