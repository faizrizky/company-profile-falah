"use client";

import { useEffect } from "react";

/** Top-level fields of the right panel (each becomes a collapsible card). */
const FIELD = '[class*="_PuckFields-field_"]';
/** The field's own title, before its content. */
const LABEL = ':scope > [class*="_InputWrapper_"] > [class*="_Input_"] > [class*="_Input-label_"], :scope > [class*="_Input_"] > [class*="_Input-label_"], :scope [class*="_Input-label_"]';

const DURATION = 220;

/** Collapsed cards, by label, kept while the editor is open. */
const collapsed = new Set<string>();

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/**
 * Animates an element's own height between two layouts: `change` switches
 * the layout (e.g. folds the card), the element eases from the old height
 * to the new one. The state itself stays in CSS/Puck, so it survives
 * React re-renders.
 */
function morphHeight(el: HTMLElement, change: () => void, after?: () => void) {
  if (reduceMotion()) {
    change();
    after?.();
    return;
  }
  const from = el.getBoundingClientRect().height;
  change();
  const to = el.getBoundingClientRect().height;
  const run = el.animate(
    [
      { height: `${from}px`, overflow: "hidden" },
      { height: `${to}px`, overflow: "hidden" },
    ],
    { duration: DURATION, easing: EASE },
  );
  run.onfinish = () => after?.();
}

/** Closing: shrink to `to` first, then apply the closed layout. */
function shrinkTo(el: HTMLElement, to: number, done: () => void) {
  if (reduceMotion()) return done();
  const from = el.getBoundingClientRect().height;
  const run = el.animate(
    [
      { height: `${from}px`, overflow: "hidden" },
      { height: `${to}px`, overflow: "hidden" },
    ],
    { duration: DURATION, easing: EASE },
  );
  run.onfinish = done;
}

function enhance(field: HTMLElement) {
  const label = field.querySelector(LABEL);
  if (!(label instanceof HTMLElement) || label.querySelector(".studio-card-toggle")) return;

  const key = label.textContent?.trim() ?? "";
  const toggle = document.createElement("span");
  toggle.className = "studio-card-toggle";
  toggle.setAttribute("aria-hidden", "true");
  label.appendChild(toggle);
  label.classList.add("studio-card-title");
  label.setAttribute("role", "button");
  label.tabIndex = 0;

  const setOpen = (open: boolean) => {
    field.toggleAttribute("data-collapsed", !open);
    label.setAttribute("aria-expanded", String(open));
  };

  const flip = (event: Event) => {
    // A label click would focus the input; on a card title it folds the card.
    event.preventDefault();
    const open = field.hasAttribute("data-collapsed");
    if (open) {
      collapsed.delete(key);
      morphHeight(field, () => setOpen(true));
    } else {
      collapsed.add(key);
      // Height of the folded card: its padding + the title.
      const style = getComputedStyle(field);
      const folded =
        label.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + 2;
      shrinkTo(field, folded, () => setOpen(false));
    }
  };
  label.addEventListener("click", flip);
  label.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") flip(event);
  });

  setOpen(!collapsed.has(key));
}

/**
 * Right panel: every top-level field is a card that folds from its title,
 * so long blocks don't need endless scrolling. Works on Puck's own DOM.
 */
const ARRAY_ITEM = '[class*="_ArrayFieldItem_"]';
const ARRAY_SUMMARY = '[class*="_ArrayFieldItem-summary_"]';
const EXPANDED = /_ArrayFieldItem--isExpanded_/;

/** List rows (Small cards, Buttons…): Puck opens/closes them instantly; ease the height. */
function onArrayClick(event: MouseEvent) {
  const summary = (event.target as Element | null)?.closest?.(ARRAY_SUMMARY);
  // Only the row title itself (not its copy / delete / drag buttons).
  if (!summary || (event.target as Element).closest("button")) return;
  const item = summary.closest<HTMLElement>(ARRAY_ITEM);
  if (!item || item.dataset.studioReplay) return;

  if (EXPANDED.test(item.className)) {
    // Closing: shrink first, then let Puck close it.
    event.preventDefault();
    event.stopPropagation();
    shrinkTo(item, (summary as HTMLElement).getBoundingClientRect().height, () => {
      item.dataset.studioReplay = "1";
      (summary as HTMLElement).click();
      delete item.dataset.studioReplay;
    });
  } else {
    // Opening: after Puck renders the body, grow from the summary's height.
    const from = item.getBoundingClientRect().height;
    requestAnimationFrame(() => {
      if (reduceMotion()) return;
      const to = item.getBoundingClientRect().height;
      item.animate(
        [
          { height: `${from}px`, overflow: "hidden" },
          { height: `${to}px`, overflow: "hidden" },
        ],
        { duration: DURATION, easing: EASE },
      );
    });
  }
}

export function StudioFieldCollapse() {
  useEffect(() => {
    document.addEventListener("click", onArrayClick, true);
    const scan = () => document.querySelectorAll<HTMLElement>(FIELD).forEach(enhance);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onArrayClick, true);
    };
  }, []);
  return null;
}
