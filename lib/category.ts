import { categories } from "@/data/category/categories";
import { categoryDetails } from "@/data/category/categoryDetails";
import type { CategoryDetail } from "@/types/category";

export { categories };

export function getCategoryDetailBySlug(slug: string): CategoryDetail | undefined {
  return categoryDetails.find((d) => d.slug === slug);
}
