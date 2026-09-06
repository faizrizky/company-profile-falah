import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pill } from "@/components/sections/solution/vts/pill";

export function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/solution/virtual-training-suite/cta.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/70 to-surface-dark/90" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[800px] flex-col items-center gap-8 px-6 py-24 text-center md:py-28">
        <span className={pill}>Let&apos;s Build Future-Ready Operations</span>
        <h2 className="font-display text-[28px] font-bold leading-tight text-text-accent md:text-[30px]">
          Ready to Build Smarter Training &amp; Operations?
        </h2>
        <p className="max-w-[640px] text-[15px] leading-relaxed text-white md:text-base">
          Partner with Falah Inovasi Teknologi to develop immersive training systems,
          operational technologies, and digital solutions.
        </p>
        <Button href="/contact" variant="fill" size="lg">
          Request Consultation
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
