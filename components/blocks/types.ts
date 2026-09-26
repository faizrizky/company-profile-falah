import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Certification, Partner, Product, SiteSetting, SolutionCategory } from "@/types/cms";

/** Data shared across blocks, loaded once per page (site) or once per session (visual editor). */
export type SiteData = {
  partners: Partner[];
  certifications: Certification[];
  categories: SolutionCategory[];
  products: Product[];
  settings: SiteSetting | null;
};

export type BlockContext = { locale: Locale; t: Dictionary; data: SiteData };

/**
 * Blocks are plain, synchronous components (no data fetching, no server-only
 * imports) so the exact same code renders the public site and the preview
 * inside the visual editor.
 */
export type BlockProps<T> = { block: T; ctx: BlockContext };
