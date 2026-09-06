import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Head } from "@/components/common/section-ui";
import { A } from "@/components/sections/about/data";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-12.5 md:px-20">
      <Image src={A.ctaBgMobile} alt="" fill className="-z-20 object-cover md:hidden" />
      <Image src={A.ctaBg} alt="" fill className="-z-20 hidden object-cover md:block" />
      <div className="relative mx-auto flex w-full max-w-[800px] flex-col items-center gap-8">
        <Head
          pill="Let's Build Future-Ready Operations"
          title="Ready to Build Smarter Training & Operations?"
          desc="Partner with Falah Inovasi Teknologi to develop immersive training systems, operational technologies, and digital solutions."
        />
        <Button href="/contact" variant="fill" size="lg" className="w-full md:w-fit">
          Request Consultation
          <img src={A.iconArrow} alt="" className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
}
