import { Head } from "@/components/common/section-ui";
import {
  A,
  PARTNERS_ROW_1,
  PARTNERS_ROW_2,
} from "@/components/sections/about/data";

export function TrustSection() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-dark px-6 py-12.5 md:px-20">
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
        <Head
          className="max-w-[682px]"
          pill="Trusted Across Critical Industries"
          title="Trusted by Government, Defense, Education, and Enterprise Institutions"
          desc="Trusted to deliver simulation, training, and operational technology solutions for modern organizations."
        />
        <div className="relative h-[300px] w-full overflow-hidden">
          <div className="flex h-[100px] w-max items-center animate-marquee">
            {[...PARTNERS_ROW_1, ...PARTNERS_ROW_1].map((p, i) => (
              <img key={i} src={p.src} alt={p.alt} className="mr-[45px] h-8 w-auto opacity-70" />
            ))}
          </div>
          <div className="mt-[27px] flex h-[173px] w-max items-center animate-marquee [animation-direction:reverse]">
            {[...PARTNERS_ROW_2, ...PARTNERS_ROW_2].map((p, i) => (
              <img key={i} src={p.src} alt={p.alt} className="mr-[45px] h-8 w-auto opacity-70" />
            ))}
          </div>
          <div className="absolute bottom-[50px] left-1/2 h-[5px] w-[574px] -translate-x-1/2 bg-[#1866EF] shadow-[0_0_10px_rgba(59,130,246,1)]" />
        </div>
      </div>
      <img src={A.gradasi} alt="" className="pointer-events-none absolute left-0 top-0 h-[600px] w-full" />
    </section>
  );
}
