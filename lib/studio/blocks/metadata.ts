import type { BlockContext } from "@/components/blocks/types";
import type { Footer as FooterData, Navigation } from "@/types/cms";

/** Everything the canvas needs to render exactly like the live site. */
export type StudioMetadata = {
  ctx: BlockContext;
  fontClass: string;
  chrome: { navigation: Navigation | null; footer: FooterData | null };
};

export type AnyProps = Record<string, unknown>;

/** The canvas metadata Puck passes to every render. */
export const meta = (puck: { metadata: unknown }) => puck.metadata as StudioMetadata;
