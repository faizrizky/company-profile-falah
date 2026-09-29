"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FaqBlock } from "@/types/cms";

type Item = NonNullable<FaqBlock["items"]>[number];

/**
 * Question cards. Desktop shows every answer (as in the design); mobile
 * (Figma Mobile - FAQ_b) is an accordion — tapping a question opens its answer.
 */
export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item, i) => (
        <Card key={item.id ?? item.question} className="relative flex h-full flex-col px-5 py-4 backdrop-blur-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-9px] h-[14px] w-[540px] max-w-full -translate-x-1/2 rounded-full bg-accent/50 blur-[50px] md:left-[46px] md:top-[-8px] md:translate-x-0"
          />
          <h3 className="font-display text-sm font-bold leading-4 text-accent md:leading-5">
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full cursor-pointer text-left md:pointer-events-none md:cursor-auto"
            >
              {item.question}
            </button>
          </h3>
          {item.answer && (
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out md:grid-rows-[1fr] md:opacity-100",
                open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <p className="min-h-0 overflow-hidden whitespace-pre-line pt-2 text-sm leading-6 text-white">
                {item.answer}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
