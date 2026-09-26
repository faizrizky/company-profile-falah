import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChallengesSection } from "@/components/solution-category/ChallengesSection";
import { CtaSection } from "@/components/solution-category/CtaSection";
import { HeroSection } from "@/components/solution-category/HeroSection";
import { ShowcaseSection } from "@/components/solution-category/ShowcaseSection";
import { Reveal } from "@/components/ui/reveal";
import { mediaUrl } from "@/lib/cms/media";
import { getSolutionCategories, getSolutionCategory } from "@/lib/cms/queries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { locale: string; category: string };

async function getDetail(slug: string, locale: Locale) {
  const category = await getSolutionCategory(slug, locale);
  return category?.hasDetailPage ? category : null;
}

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getSolutionCategories("en");
  return locales.flatMap((locale) =>
    categories.filter((c) => c.hasDetailPage).map((c) => ({ locale, category: c.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, category: slug } = await params;
  if (!isLocale(locale)) return {};
  const category = await getDetail(slug, locale);
  if (!category) return {};
  const image = mediaUrl(category.meta?.image) ?? mediaUrl(category.hero?.image);
  return {
    title: category.meta?.title || category.title,
    description: category.meta?.description || category.hero?.description || undefined,
    openGraph: image ? { images: [image] } : undefined,
    alternates: localeAlternates(`solution/${category.slug}`, locale),
  };
}

export default async function SolutionCategoryPage({ params }: { params: Promise<Params> }) {
  const { locale, category: slug } = await params;
  if (!isLocale(locale)) notFound();
  const category = await getDetail(slug, locale);
  if (!category) notFound();
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col bg-surface-dark">
      <Reveal>
        <HeroSection category={category} t={t} />
      </Reveal>
      <Reveal>
        <ChallengesSection category={category} />
      </Reveal>
      <Reveal>
        <ShowcaseSection category={category} />
      </Reveal>
      <Reveal>
        <CtaSection category={category} t={t} />
      </Reveal>
    </div>
  );
}
