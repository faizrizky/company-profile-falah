"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button, Puck, useGetPuck, type Data, type Viewports } from "@puckeditor/core";
import { ExternalLink, Save } from "lucide-react";

import type { SiteData } from "@/components/blocks/types";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { StudioApiError, savePage } from "@/lib/studio/cms-api";
import { createStudioConfig, type StudioMetadata } from "@/lib/studio/config";
import { layoutToPuck, puckTitle, puckToLayout } from "@/lib/studio/convert";
import { puckDictionaryId, studioStrings, type StudioLang, type StudioStrings } from "@/lib/studio/strings";
import type { Footer, Navigation, Page, User } from "@/types/cms";

const VIEWPORTS = { desktop: 1440, tablet: 768, mobile: 375 } as const;
const IFRAME = { enabled: true, waitForStyles: true };

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export type StudioEditorProps = {
  page: Pick<Page, "id" | "title" | "slug" | "layout" | "_status">;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  user: Pick<User, "email" | "name">;
  cmsUrl: string;
  siteData: SiteData;
  chrome: { navigation: Navigation | null; footer: Footer | null };
  dictionary: Dictionary;
  fontClass: string;
};

type SaveFn = (data: Data, publish: boolean) => Promise<void>;

/** Header controls next to Puck's Publish button — kept to the same few as the Puck demo. */
function HeaderActions({
  children,
  props,
  s,
  saving,
  onSave,
}: {
  children: ReactNode;
  props: StudioEditorProps;
  s: StudioStrings;
  saving: boolean;
  onSave: SaveFn;
}) {
  const getPuck = useGetPuck();
  const pagePath = `/${props.locale}${props.page.slug === "home" ? "" : `/${props.page.slug}`}`;

  const switchContentLanguage = (locale: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("locale", locale);
    window.location.search = params.toString();
  };

  return (
    <div className="studio-actions">
      <label className="studio-select" title={`${s.contentLanguage} — ${s.structureShared}`}>
        <span className="sr-only">{s.contentLanguage}</span>
        <select value={props.locale} onChange={(e) => switchContentLanguage(e.target.value)} aria-label={s.contentLanguage}>
          {locales.map((code) => (
            <option key={code} value={code} title={localeNames[code]}>
              {code.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      {/* Labels collapse to icons on narrow screens (see studio.css). */}
      <Button variant="secondary" href={pagePath} newTab icon={<ExternalLink size={16} />}>
        <span className="studio-label">{s.viewSite}</span>
      </Button>
      <Button
        variant="secondary"
        disabled={saving}
        icon={<Save size={16} />}
        onClick={() => onSave(getPuck().appState.data, false)}
      >
        <span className="studio-label">{saving ? s.saving : s.saveDraft}</span>
      </Button>
      {children}
    </div>
  );
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true afterwards. */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Puck is client-only by nature (initial layout depends on the window size,
 * ids feed its drag & drop registry). Rendering it after hydration keeps the
 * server and client trees identical, so no ids get out of sync.
 */
export function StudioEditor(props: StudioEditorProps) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return <div className={props.embedded ? "studio-embedded" : "studio-standalone"} aria-busy="true" />;
  }
  return <StudioEditorClient {...props} />;
}

function StudioEditorClient(props: StudioEditorProps) {
  const { page, locale, uiLang, embedded, cmsUrl, siteData, chrome, dictionary, fontClass } = props;
  const s = studioStrings[uiLang];

  const config = useMemo(
    () => createStudioConfig({ lang: uiLang, locale, cmsUrl, data: siteData, pageId: page.id, embedded }),
    [uiLang, locale, cmsUrl, siteData, page.id, embedded],
  );
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

  // On a desktop-sized editor start with both panels open and the desktop preview.
  const initialUi = useMemo(
    () =>
      window.innerWidth >= 1024
        ? {
            leftSideBarVisible: true,
            rightSideBarVisible: true,
            viewports: {
              current: { width: VIEWPORTS.desktop, height: "auto" as const },
              controlsVisible: true,
              options: [],
            },
          }
        : undefined,
    [],
  );

  const savedRef = useRef(JSON.stringify([page.title, page.layout]));
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Leaving with unsaved changes (closing, switching language) asks first.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (status.kind !== "success") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  const onChange = useCallback(
    (data: Data) => setDirty(JSON.stringify([puckTitle(data, page.title), puckToLayout(data)]) !== savedRef.current),
    [page.title],
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

  return (
    // Inside the CMS the editor sheds its own chrome (title, coloured rail,
    // backdrop) so it reads as part of the admin page — see studio.css.
    <div className={embedded ? "studio-embedded" : "studio-standalone"}>
      <Puck
        config={config}
        data={initialData}
        metadata={metadata}
        ui={initialUi}
        viewports={viewports}
        iframe={IFRAME}
        dictionary={uiLang === "id" ? puckDictionaryId : undefined}
        headerTitle={embedded ? "" : page.title}
        headerPath={embedded ? "" : `/${locale}${page.slug === "home" ? "" : `/${page.slug}`}`}
        onChange={onChange}
        onPublish={(data) => save(data, true)}
        overrides={{
          headerActions: ({ children }) => (
            <HeaderActions props={props} s={s} saving={status.kind === "saving"} onSave={save}>
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
    </div>
  );
}
