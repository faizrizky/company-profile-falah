import { mediaAlt, mediaUrl } from "@/lib/cms/media";
import type { Product, SolutionCategory } from "@/types/cms";

export type MegaMenuProduct = {
  id: number;
  title: string;
  summary?: string;
  image?: string;
  alt: string;
};

export type MegaMenuCategory = {
  id: number;
  title: string;
  /** Only set when the category has a detail page. */
  href?: string;
  products: MegaMenuProduct[];
};

const categoryId = (p: Product) => (typeof p.category === "object" ? p.category.id : p.category);

/**
 * The "Our Solutions" mega menu: every solution category with its products,
 * in CMS order. Trimmed to what the menu shows, since it ships to the
 * browser on every page.
 */
export function buildMegaMenu(categories: SolutionCategory[], products: Product[]): MegaMenuCategory[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    href: category.hasDetailPage ? `/solution/${category.slug}` : undefined,
    products: products
      .filter((p) => categoryId(p) === category.id)
      .map((p) => ({
        id: p.id,
        title: p.title,
        summary: p.summary ?? undefined,
        image: mediaUrl(p.image),
        alt: mediaAlt(p.image, p.title),
      })),
  }));
}
