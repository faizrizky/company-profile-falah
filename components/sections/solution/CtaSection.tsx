import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Head } from "@/components/common/section-ui";
import { A } from "@/components/sections/solution/assets";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-[25px] pt-12.5 md:px-20 md:pb-12.5">
      <Image src={A.ctaBgMobile} alt="" fill className="-z-20 object-cover md:hidden" />
      <Image src={A.ctaBg} alt="" fill className="-z-20 hidden object-cover md:block" />
      <div className="relative mx-auto flex w-full max-w-[800px] flex-col items-center gap-8">
        <Head
          pill="Let's Build Future-Ready Operations"
          title="Ready to Build Smarter Training & Operations?"
          desc="Partner with Falah Inovasi Teknologi to develop immersive training systems, operational technologies, and digital solutions."
        />
        <Button href="/contact" variant="fill" size="lg" className="w-full md:w-fit">
          Request Consultation <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
