import { FaqAccordion } from "@/components/home/faq-accordion";
import { A, Section, SectionHeader } from "@/components/sections/home/shared";

export function FaqSection() {
  return (
    <Section bg={A.faqBg}>
      <SectionHeader
        className="max-w-[602px]"
        eyebrow="Answers Before You Get Started"
        title="Frequently Asked Questions About Falah Solutions"
        desc="Explore common questions about Falah’s immersive simulation systems, operational technologies, and capabilities."
      />
      <FaqAccordion />
    </Section>
  );
}
