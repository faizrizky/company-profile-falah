import { Glow } from "@/components/common/section-ui";
import { A, CERTS, Section, SectionHeader } from "@/components/sections/home/shared";

export function CertSection() {
  return (
    <Section bg={A.certBg}>
      <SectionHeader
        eyebrow="Meeting Recognized Industry Standards"
        title="Certified Standards for Strategic Technology Delivery"
        desc="Falah maintains recognized standards & compliance frameworks for reliable technology delivery across operational environments."
      />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {CERTS.map((c) => (
          <div
            key={c.title}
            className="relative flex flex-col items-center gap-4 rounded-lg border border-accent/50 bg-surface-dark/5 p-4 px-10 text-center backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03] md:h-[353px]"
          >
            <Glow className="-top-3.5 left-0 h-[25px] w-[322px]" />
            <div className="flex h-[98px] items-center justify-center">
              <img src={c.icon} alt="" className={c.iconClass} />
            </div>
            <div className="flex flex-col items-center gap-4">
              <h3 className="font-display text-xl font-bold leading-7 text-white">
                {c.title}
              </h3>
              <span className="rounded-full border border-accent px-4 py-1 text-xs leading-[18px] text-white backdrop-blur-sm">
                {c.subtitle}
              </span>
              <p className="text-sm leading-6 text-white">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto h-[5px] w-[574px] rounded-full bg-blue-bright shadow-[0_0_10px_rgba(59,130,246,1)]" />
    </Section>
  );
}
