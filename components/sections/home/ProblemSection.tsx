import Image from "next/image";
import { cn } from "@/lib/utils";
import { Glow } from "@/components/common/section-ui";
import { A, PROBLEMS } from "@/components/sections/home/shared";

export function ProblemSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-12.5 lg:px-20 lg:pt-25 lg:pb-12">
      <Image src={A.problemBg} alt="" fill className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#0A0A0A] lg:bg-surface-dark/60" />
      <div className="relative mx-auto flex w-full max-w-[1269px] flex-col items-center gap-8">
        <div className="flex w-full max-w-[564px] flex-col items-center gap-3 text-center">
          <span className="hidden items-center gap-1 rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-sm text-white backdrop-blur-sm lg:flex">
            Traditional Training Has Limitations
          </span>
          <h2 className="max-w-[900px] font-display text-[30px] font-bold leading-9 text-accent">
            Modern Training Demands More than Traditional Methods
          </h2>
          <p className="max-w-[720px] text-base leading-6 text-white">
            Modern organizations require immersive & practical training to
            improve readiness, safety, and operational performance.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[600px_1fr]">
          <div className="flex flex-col gap-4">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className={cn(
                  "relative rounded-lg border border-accent/50 p-7 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03]",
                  p.desc ? "bg-accent/15" : "bg-surface-dark/5",
                )}
              >
                <Glow className="-top-[7px] left-1/2 h-[15px] w-[416px] -translate-x-1/2" />

                <div className="flex items-center gap-[31px]">
                  <img
                    src={p.icon}
                    alt=""
                    className="h-7 w-7 shrink-0 shadow-[0_0_4px_rgba(24,102,239,1)]"
                  />

                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-xl font-bold leading-6 text-white">
                      {p.title}
                    </h3>

                    {p.desc && (
                      <p className="text-sm leading-5 text-white/80">
                        {p.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <Glow className="left-0 top-0 h-[25px] w-[600px]" />

            <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg border border-accent/50">
              <Image
                src={A.problemImage}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
