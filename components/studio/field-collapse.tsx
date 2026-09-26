"use client";

import { useEffect } from "react";

/** Top-level fields of the right panel (each becomes a collapsible card). */
const FIELD = '[class*="_PuckFields-field_"]';
/** The field's own title, before its content. */
const LABEL = ':scope > [class*="_InputWrapper_"] > [class*="_Input_"] > [class*="_Input-label_"], :scope > [class*="_Input_"] > [class*="_Input-label_"], :scope [class*="_Input-label_"]';

const DURATION = 220;

/** Collapsed cards, by label, kept while the editor is open. */
const collapsed = new Set<string>();

function contentOf(label: Element): HTMLElement[] {
  return [...(label.parentElement?.children ?? [])].filter((el): el is HTMLElement => el !== label && el instanceof HTMLElement);
}

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Height + fade; the collapsed state itself is CSS (`[data-collapsed]`), so it survives React re-renders. */
function animate(els: HTMLElement[], open: boolean, done: () => void) {
  if (reduceMotion() || !els.length) return done();
  const frames = els.map((el) => [
    { height: "0px", opacity: 0, overflow: "hidden" },
    { height: `${el.scrollHeight}px`, opacity: 1, overflow: "hidden" },
  ]);
  let pending = els.length;
  els.forEach((el, i) => {
    const run = el.animate(open ? frames[i] : [...frames[i]].reverse(), {
      duration: DURATION,
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
    run.onfinish = () => {
      if (--pending === 0) done();
    };
  });
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
      setOpen(true);
      animate(contentOf(label), true, () => {});
    } else {
      collapsed.add(key);
      animate(contentOf(label), false, () => setOpen(false));
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
export function StudioFieldCollapse() {
  useEffect(() => {
    const scan = () => document.querySelectorAll<HTMLElement>(FIELD).forEach(enhance);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
