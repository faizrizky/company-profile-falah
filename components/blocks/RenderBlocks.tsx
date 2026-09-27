import type { ComponentType } from "react";

import { CertificationsBlock } from "@/components/blocks/Certifications";
import { ContactFormBlock } from "@/components/blocks/ContactForm";
import { CtaBlock } from "@/components/blocks/Cta";
import { ExpertiseBlock } from "@/components/blocks/Expertise";
import { FaqBlock } from "@/components/blocks/Faq";
import { FeatureGridBlock } from "@/components/blocks/FeatureGrid";
import { HeroBlock } from "@/components/blocks/Hero";
import { LayoutSectionBlock } from "@/components/blocks/LayoutSection";
import { ElementView } from "@/components/blocks/elements";
import { LeadershipBlock } from "@/components/blocks/Leadership";
import { OfficeMapBlock } from "@/components/blocks/OfficeMap";
import { PartnersBlock } from "@/components/blocks/Partners";
import { ProblemShowcaseBlock } from "@/components/blocks/ProblemShowcase";
import { SolutionHighlightsBlock } from "@/components/blocks/SolutionHighlights";
import { SolutionOverviewBlock } from "@/components/blocks/SolutionOverview";
import { TeamStatsBlock } from "@/components/blocks/TeamStats";
import { VideoShowcaseBlock } from "@/components/blocks/VideoShowcase";
import { WorkflowBlock } from "@/components/blocks/Workflow";
import { Reveal } from "@/components/ui/reveal";
import type { Page } from "@/types/cms";

import type { BlockContext } from "./types";

type Block = Page["layout"][number];
type BlockType = Block["blockType"];
type BlockComponent<T extends BlockType> = ComponentType<{
  block: Extract<Block, { blockType: T }>;
  ctx: BlockContext;
}>;

/** Small elements placed directly on the page. */
function ElementBlock({ block }: { block: Parameters<typeof ElementView>[0]["element"] }) {
  return <ElementView element={block} />;
}

/**
 * blockType → component. Typed so adding a block in the CMS without a
 * matching component here fails type-checking after `npm run sync:cms-types`.
 */
const components: { [T in BlockType]: BlockComponent<T> } = {
  hero: HeroBlock,
  problemShowcase: ProblemShowcaseBlock,
  videoShowcase: VideoShowcaseBlock,
  solutionHighlights: SolutionHighlightsBlock,
  expertise: ExpertiseBlock,
  featureGrid: FeatureGridBlock,
  leadership: LeadershipBlock,
  teamStats: TeamStatsBlock,
  partners: PartnersBlock,
  certifications: CertificationsBlock,
  solutionOverview: SolutionOverviewBlock,
  faq: FaqBlock,
  workflow: WorkflowBlock,
  contactForm: ContactFormBlock,
  officeMap: OfficeMapBlock,
  cta: CtaBlock,
  layoutSection: LayoutSectionBlock,
  badge: ElementBlock,
  heading: ElementBlock,
  paragraph: ElementBlock,
  image: ElementBlock,
  button: ElementBlock,
  card: ElementBlock,
  spacer: ElementBlock,
};

export const blockComponents = components;

export function RenderBlocks({ blocks, ctx }: { blocks: Page["layout"]; ctx: BlockContext }) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = components[block.blockType] as BlockComponent<typeof block.blockType> | undefined;
        if (!Component) return null;
        return (
          <Reveal key={block.id ?? index}>
            <Component block={block} ctx={ctx} />
          </Reveal>
        );
      })}
    </>
  );
}
