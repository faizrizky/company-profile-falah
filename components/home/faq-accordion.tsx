"use client";

import { useId, useState } from "react";

import type { FaqBlock } from "@/types/cms";

type Item = NonNullable<FaqBlock["items"]>[number];

export function FaqAccordion({ items }: { items: Item[] }) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${id}-${i}`;
        return (
          <div
            key={item.id ?? item.question}
            className="relative flex h-full flex-col gap-2 rounded-lg border border-accent/50 bg-surface-dark/5 p-4 px-5 backdrop-blur-sm"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-[46px] top-[-8px] h-[14px] w-[540px] rounded-full bg-accent/50 blur-[50px]"
            />
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center text-left font-display text-sm font-bold leading-4 text-accent"
            >
              {item.question}
            </button>
            {open && (
              <p id={panelId} className="whitespace-pre-line text-sm leading-6 text-white">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
