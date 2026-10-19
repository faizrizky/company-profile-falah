"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

const DRAG_THRESHOLD = 5;

/**
 * Lets a mouse drag a horizontally scrolling row (touch and trackpads already
 * scroll it natively). A drag never counts as a click on what is under it.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent<T>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return;
    drag.current = { x: event.clientX, left: ref.current.scrollLeft, moved: false };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<T>) => {
    const state = drag.current;
    if (!state || !ref.current) return;
    const delta = event.clientX - state.x;
    if (!state.moved && Math.abs(delta) < DRAG_THRESHOLD) return;
    if (!state.moved) {
      state.moved = true;
      ref.current.setPointerCapture(event.pointerId);
    }
    ref.current.scrollLeft = state.left - delta;
  }, []);

  const end = useCallback(() => {
    // Keep `moved` until the click that follows the release has been swallowed.
    window.setTimeout(() => (drag.current = null), 0);
  }, []);

  const onClickCapture = useCallback((event: React.MouseEvent<T>) => {
    if (!drag.current?.moved) return;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onClickCapture };
}
