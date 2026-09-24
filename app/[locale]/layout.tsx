import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { asMedia, mediaUrl } from "@/lib/cms/media";
import { fontVariables } from "@/lib/fonts";
import { buildMegaMenu } from "@/lib/cms/mega-menu";
import {
  getFooter,
  getNavigation,
  getProducts,
  getSiteSettings,
  getSolutionCategories,
} from "@/lib/cms/queries";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

const FALLBACK_TITLE = "Falah Inovasi Teknologi";

type Params = { locale: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = await getSiteSettings(locale);
  const siteName = settings?.siteName ?? FALLBACK_TITLE;
  const logo = mediaUrl(settings?.logo);
  return {
    title: { default: siteName, template: `%s | ${siteName}` },
    description: settings?.siteDescription,
    openGraph: {
      siteName,
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      images: logo ? [logo] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<Params> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [settings, navigation, footer, categories, products] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale),
    getFooter(locale),
    getSolutionCategories(locale),
    getProducts(locale),
  ]);
  const t = getDictionary(locale);

  return (
    <html lang={locale}>
      <body className={`${fontVariables} font-sans antialiased`}>
        <LocaleProvider locale={locale} t={t}>
          {navigation && (
            <Navbar
              navigation={navigation}
              solutions={buildMegaMenu(categories, products)}
              logo={asMedia(settings?.logo)}
            />
          )}
          <main>{children}</main>
          {footer && settings && <Footer footer={footer} settings={settings} contactLabel={t.footer.contact} />}
        </LocaleProvider>
      </body>
    </html>
  );
}
