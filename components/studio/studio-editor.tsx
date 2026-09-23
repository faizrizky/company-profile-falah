"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Puck, useGetPuck, type Data, type Viewports } from "@puckeditor/core";

import type { SiteData } from "@/components/blocks/types";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { StudioApiError, savePage } from "@/lib/studio/cms-api";
import { createStudioConfig, type StudioMetadata } from "@/lib/studio/config";
import { layoutToPuck, puckTitle, puckToLayout } from "@/lib/studio/convert";
import { puckDictionaryId, studioStrings, type StudioLang, type StudioStrings } from "@/lib/studio/strings";
import type { Footer, Navigation, Page, User } from "@/types/cms";

const VIEWPORTS = { desktop: 1440, tablet: 768, mobile: 375 } as const;

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export type StudioEditorProps = {
  page: Pick<Page, "id" | "title" | "slug" | "layout" | "_status">;
  locale: Locale;
  uiLang: StudioLang;
  user: Pick<User, "email" | "name">;
  cmsUrl: string;
  siteData: SiteData;
  chrome: { navigation: Navigation | null; footer: Footer | null };
  dictionary: Dictionary;
  fontClass: string;
};

type SaveFn = (data: Data, publish: boolean) => Promise<void>;
type SwitchLink = (param: "locale" | "ui", value: string) => { href: string; onClick: (e: React.MouseEvent) => void };

/**
 * Extra header controls next to Puck's own Publish button: content language,
 * interface language, save draft, view page, back to the CMS.
 */
function HeaderActions({
  children,
  props,
  s,
  dirty,
  saving,
  onSave,
  switchLink,
}: {
  children: ReactNode;
  props: StudioEditorProps;
  s: StudioStrings;
  dirty: boolean;
  saving: boolean;
  onSave: SaveFn;
  switchLink: SwitchLink;
}) {
  const getPuck = useGetPuck();
  const pagePath = `/${props.locale}${props.page.slug === "home" ? "" : `/${props.page.slug}`}`;

  return (
    <div className="studio-actions">
      <span className={`studio-dot${dirty ? " is-dirty" : ""}`} title={dirty ? s.unsaved : s.upToDate} aria-label={dirty ? s.unsaved : s.upToDate} role="img" />

      <div className="studio-segment" role="group" aria-label={s.contentLanguage} title={s.structureShared}>
        {locales.map((code) => (
          <a
            key={code}
            {...switchLink("locale", code)}
            className={code === props.locale ? "is-active" : ""}
            aria-current={code === props.locale ? "true" : undefined}
            title={`${s.contentLanguage}: ${localeNames[code]}`}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>

      <a className="studio-btn studio-btn--ghost" href={`${props.cmsUrl}/admin/collections/pages/${props.page.id}`}>
        {s.backToCms}
      </a>
      <a className="studio-btn studio-btn--ghost" href={pagePath} target="_blank" rel="noopener noreferrer">
        {s.viewSite}
      </a>
      <button
        type="button"
        className="studio-btn studio-btn--ghost"
        disabled={saving}
        onClick={() => onSave(getPuck().appState.data, false)}
      >
        {saving ? s.saving : s.saveDraft}
      </button>
      {children}

      <div className="studio-segment" role="group" aria-label={s.uiLanguage} title={s.uiLanguage}>
        {(["id", "en"] as const).map((code) => (
          <a
            key={code}
            {...switchLink("ui", code)}
            className={code === props.uiLang ? "is-active" : ""}
            aria-current={code === props.uiLang ? "true" : undefined}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  );
}

export function StudioEditor(props: StudioEditorProps) {
  const { page, locale, uiLang, cmsUrl, siteData, chrome, dictionary, fontClass } = props;
  const s = studioStrings[uiLang];
  const searchParams = useSearchParams();

  const config = useMemo(() => createStudioConfig({ lang: uiLang, cmsUrl, data: siteData }), [uiLang, cmsUrl, siteData]);
  const initialData = useMemo(() => layoutToPuck(page.layout, page.title), [page.layout, page.title]);
  const metadata = useMemo<StudioMetadata>(
    () => ({ ctx: { locale, t: dictionary, data: siteData }, fontClass, chrome }),
    [locale, dictionary, siteData, fontClass, chrome],
  );
  const viewports = useMemo<Viewports>(
    () => [
      { width: VIEWPORTS.mobile, label: s.mobile, icon: "Smartphone" },
      { width: VIEWPORTS.tablet, label: s.tablet, icon: "Tablet" },
      { width: VIEWPORTS.desktop, label: s.desktop, icon: "Monitor" },
    ],
    [s],
  );

  const snapshot = (data: Data) => JSON.stringify([puckTitle(data, page.title), puckToLayout(data)]);
  const savedRef = useRef(JSON.stringify([page.title, page.layout]));
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (status.kind !== "success") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const onChange = useCallback(
    (data: Data) => setDirty(snapshot(data) !== savedRef.current),
    // snapshot only depends on page.title, which is fixed for this editor instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const save: SaveFn = async (data, publish) => {
    const title = puckTitle(data, page.title);
    const layout = puckToLayout(data);
    setStatus({ kind: "saving" });
    try {
      await savePage(cmsUrl, page.id, { title, layout }, { locale, publish });
      savedRef.current = JSON.stringify([title, layout]);
      setDirty(false);
      setStatus({ kind: "success", message: publish ? s.published : s.saved });
    } catch (error) {
      const code = error instanceof StudioApiError ? error.status : 0;
      const message = code === 401 ? s.sessionExpired : code === 403 ? s.forbidden : (error as Error).message || "Error";
      setStatus({ kind: "error", message });
    }
  };

  /** Language switches are plain links to the same page with a different query (confirm if unsaved). */
  const switchLink: SwitchLink = (param, value) => {
    const next = new URLSearchParams(searchParams?.toString());
    next.set(param, value);
    return {
      href: `?${next}`,
      onClick: (e) => {
        if (dirty && !window.confirm(s.switchLangConfirm)) e.preventDefault();
        else setDirty(false);
      },
    };
  };

  return (
    <>
      <Puck
        config={config}
        data={initialData}
        metadata={metadata}
        viewports={viewports}
        iframe={{ enabled: true, waitForStyles: true }}
        dictionary={uiLang === "id" ? puckDictionaryId : undefined}
        headerTitle={page.title}
        headerPath={`/${locale}${page.slug === "home" ? "" : `/${page.slug}`}`}
        onChange={onChange}
        onPublish={(data) => save(data, true)}
        overrides={{
          headerActions: ({ children }) => (
            <HeaderActions
              props={props}
              s={s}
              dirty={dirty}
              saving={status.kind === "saving"}
              onSave={save}
              switchLink={switchLink}
            >
              {children}
            </HeaderActions>
          ),
        }}
      />
      {status.kind === "success" || status.kind === "error" ? (
        <div role={status.kind === "error" ? "alert" : "status"} className={`studio-toast is-${status.kind}`}>
          {status.message}
        </div>
      ) : null}
    </>
  );
}
