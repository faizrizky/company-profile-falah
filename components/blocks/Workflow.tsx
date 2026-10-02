import { SectionTitle } from "@/components/common/section-ui";
import { cn } from "@/lib/utils";
import type { WorkflowBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function WorkflowBlock({ block }: BlockProps<Data>) {
  const steps = (block.steps ?? []).map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));
  const last = steps.length - 1;
  const head = (
    <SectionTitle
      variant="contact"
      eyebrow={block.header.eyebrow}
      title={block.header.title}
      desc={block.header.description}
    />
  );

  return (
    <section className="flex flex-col items-center bg-surface-dark">
      <div className="flex w-full flex-col gap-8 bg-[#0A0A0A]/50 pt-[50px] md:hidden">
        {head}
        <ol className="flex w-full flex-col px-6">
          {steps.map((f, i) => (
            <li key={f.id ?? f.n} className={cn("flex gap-1", i === 0 && "pt-[15px]", i === last && "pb-[87px]")}>
              <div className="relative flex w-3 flex-col items-center">
                <span
                  className="workflow-dot absolute left-0 top-[9px] h-3 w-3 rounded-full bg-[#1866EF]"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {i !== last && <span className="w-px flex-1 bg-accent" />}
              </div>
              <div className="flex flex-1 flex-col gap-2 pb-6 pl-2">
                <h3 className="font-display text-[15px] font-bold leading-[30px] text-accent">
                  {f.n} {f.title}
                </h3>
                {f.description && <p className="text-xs leading-5 text-white">{f.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden flex-col items-center gap-8 px-page pb-12.5 pt-25 md:flex">
        {head}
        <ol className="flex w-[1280px] max-w-full justify-center">
          {steps.map((f, i) => (
            <li key={f.id ?? f.n} className="flex w-50 flex-col gap-4">
              <div className="flex h-9 items-center justify-center font-display text-[40px] font-bold leading-6 text-accent">
                {f.n}
              </div>
              <div className="flex h-3 items-center">
                <span className={cn("h-px flex-1", i !== 0 && "bg-accent/80")} />
                <span
                  className="workflow-dot h-3 w-3 rounded-full bg-[#1866EF]"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <span className={cn("h-px flex-1", i !== last && "bg-accent/80")} />
              </div>
              <div className="flex flex-col gap-2 px-2 text-center">
                <h3 className="font-display text-xl font-bold leading-[30px] text-accent">{f.title}</h3>
                {f.description && <p className="text-sm leading-5 text-white">{f.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
