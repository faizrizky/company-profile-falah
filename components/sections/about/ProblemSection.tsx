import Image from "next/image";
import { Glow, Head } from "@/components/common/section-ui";
import { A, PROBLEM_CARDS } from "@/components/sections/about/data";

export function ProblemSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-25 pb-12.5 md:px-20">
      <Image src={A.problemBg} alt="" fill className="-z-20 object-fill" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[564px]"
          pill="Who Are We"
          title="Building Technology for Immersive Operations"
          desc="Falah Inovasi Teknologi develops simulation systems & immersive technologies that improve training, coordination, & performance."
        />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {PROBLEM_CARDS.map((card) => (
            <div
              key={card.title}
              className="relative flex flex-col justify-center gap-6 rounded-lg border border-accent/30 bg-surface-dark/5 p-10 backdrop-blur-[5px] transition-transform duration-300 hover:scale-[1.03]"
            >
              <Glow className="-top-[7px] left-0 h-[25px] w-full" />
              <div className="flex h-[52px] items-center justify-center">
                <img src={card.icon} alt="" className="h-[50px] w-[50px]" />
              </div>
              <div className="flex flex-col gap-4 text-left">
                <h3 className="font-display text-lg font-bold leading-6 text-white md:text-xl">
                  {card.title}
                </h3>
                <p className="text-sm leading-5 text-white">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
