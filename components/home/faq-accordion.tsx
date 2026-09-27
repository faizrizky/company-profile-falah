import { Card } from "@/components/ui/card";
import type { FaqBlock } from "@/types/cms";

type Item = NonNullable<FaqBlock["items"]>[number];

/** Question cards, answers always shown (as in the design). */
export function FaqAccordion({ items }: { items: Item[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id ?? item.question} className="relative flex h-full flex-col gap-2 px-5 py-4 backdrop-blur-sm">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[46px] top-[-8px] h-[14px] w-[540px] max-w-full rounded-full bg-accent/50 blur-[50px]"
          />
          <h3 className="font-display text-sm font-bold leading-5 text-accent">{item.question}</h3>
          {item.answer && <p className="whitespace-pre-line text-sm leading-6 text-white">{item.answer}</p>}
        </Card>
      ))}
    </div>
  );
}
