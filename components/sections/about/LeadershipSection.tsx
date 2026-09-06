import Image from "next/image";
import { cn } from "@/lib/utils";
import { Glow, Head } from "@/components/common/section-ui";
import { A, LEADERS } from "@/components/sections/about/data";

export function LeadershipSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:h-[671px] md:px-20">
      <Image src={A.leadersBg} alt="" fill className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[708px]"
          pill="Leadership"
          title="The Minds Behind Falah Innovation"
          desc="Led by experienced professionals, Falah builds future-ready operational solutions through innovation & collaboration."
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          {LEADERS.map((leader, i) => (
            <div key={leader.name} className="relative">
              <Glow className="-top-[9px] left-1/2 h-[25px] w-[416px] -translate-x-1/2" />
              <div
                className={cn(
                  "relative h-[407px] overflow-hidden rounded-lg border border-accent/50 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]",
                  i === 0 ? "bg-surface-dark/5" : "bg-accent/5",
                )}
              >
                <Image src={leader.img} alt={leader.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,13,0)_59%,rgba(5,4,13,0.5)_93%)]" />
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(5,4,13,0)_0%,rgba(5,4,13,0.5)_100%)] p-6",
                    i === 0 ? "backdrop-blur-[1px]" : "backdrop-blur-[5px]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    {leader.pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-white bg-surface-dark/5 px-4 py-1 text-xs leading-[18px] text-white"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl font-bold leading-6 text-white">
                    {leader.name}
                  </h3>
                  {leader.desc && <p className="text-xs leading-5 text-white">{leader.desc}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
