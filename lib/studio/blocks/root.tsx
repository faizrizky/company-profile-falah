"use client";

import type { ReactNode } from "react";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { buildMegaMenu } from "@/lib/cms/mega-menu";
import { asMedia } from "@/lib/cms/media";

import { meta } from "./metadata";

/** The canvas around every editor: the live site's menu and footer, with the content between. */
export function renderStudioRoot({ children, puck }: { children: ReactNode; puck: { metadata: unknown } }) {
  const { ctx, fontClass, chrome } = meta(puck);
  return (
    <div className={`${fontClass} min-h-screen bg-surface-dark font-sans antialiased`}>
      <LocaleProvider locale={ctx.locale} t={ctx.t}>
        {chrome.navigation && (
          <Navbar
            navigation={chrome.navigation}
            solutions={buildMegaMenu(ctx.data.categories, ctx.data.products)}
            logo={asMedia(ctx.data.settings?.logo)}
          />
        )}
        <main>{children}</main>
        {chrome.footer && ctx.data.settings && (
          <Footer footer={chrome.footer} settings={ctx.data.settings} labels={ctx.t.footer} />
        )}
      </LocaleProvider>
    </div>
  );
}
