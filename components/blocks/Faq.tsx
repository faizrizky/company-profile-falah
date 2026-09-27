import { Section, SectionTitle } from "@/components/common/section-ui";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { mediaUrl } from "@/lib/cms/media";
import type { FaqBlock as Data } from "@/types/cms";

import type { BlockProps } from "./types";

export function FaqBlock({ block }: BlockProps<Data>) {
  return (
    <Section bg={mediaUrl(block.background)}>
      <SectionTitle
        className="max-w-[602px]"
        eyebrow={block.header.eyebrow}
        title={block.header.title}
        desc={block.header.description}
      />
      <FaqAccordion items={block.items ?? []} />
    </Section>
  );
}
