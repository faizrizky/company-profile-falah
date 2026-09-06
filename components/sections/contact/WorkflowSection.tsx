import { cn } from "@/lib/utils";
import { FLOWS, Head } from "@/components/sections/contact/shared";

export function WorkflowSection() {
  return (
    <section className="flex flex-col items-center bg-surface-dark">
      <div className="flex w-full flex-col gap-8 bg-[#0A0A0A]/50 pt-[50px] md:hidden">
        <Head
          pill="Our Workflow"
          title="How it works?"
          desc="Falah combines immersive technologies & integrated systems to deliver scalable solutions for modern operations."
        />
        <div className="flex w-full flex-col px-6">
          {FLOWS.map((f, i) => (
            <div
              key={f.n}
              className={cn("flex gap-1", i === 0 && "pt-[15px]", i === FLOWS.length - 1 && "pb-[87px]")}
            >
              <div className="relative flex w-3 flex-col items-center">
                <span className="absolute left-0 top-[9px] h-3 w-3 rounded-full bg-[#1866EF] shadow-[0_0_4px_#1866EF]" />
                {i !== FLOWS.length - 1 && <span className="w-px flex-1 bg-accent" />}
              </div>
              <div className="flex flex-1 flex-col gap-2 pb-6 pl-2">
                <h3 className="font-display text-[15px] font-bold leading-[30px] text-accent">
                  {f.n} {f.title}
                </h3>
                <p className="text-xs leading-5 text-white">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden flex-col items-center gap-8 px-20 pb-12.5 pt-25 md:flex">
        <Head
          pill="Our Workflow"
          title="How it works?"
          desc="Falah combines immersive technologies & integrated systems to deliver scalable solutions for modern operations."
        />
        <div className="flex w-[1280px] justify-center gap-4">
          {FLOWS.map((f, i) => (
            <div key={f.n} className="flex w-50 flex-col gap-4">
              <div className="flex h-9 items-center justify-center font-display text-[40px] font-bold leading-6 text-accent">
                {f.n}
              </div>
              <div className="flex h-3 items-center">
                <span className={cn("h-px flex-1", i !== 0 && "bg-accent/80")} />
                <span className="h-3 w-3 rounded-full bg-[#1866EF] shadow-[0_0_4px_#1866EF]" />
                <span className={cn("h-px flex-1", i !== FLOWS.length - 1 && "bg-accent/80")} />
              </div>
              <div className="flex flex-col gap-2 px-2 text-center">
                <h3 className="font-display text-xl font-bold leading-[30px] text-accent">{f.title}</h3>
                <p className="text-sm leading-5 text-white">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
