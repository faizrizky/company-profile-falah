"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createUsePuck, Puck, useGetPuck, type Data, type Viewports } from "@puckeditor/core";

import type { SiteData } from "@/components/blocks/types";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { StudioApiError, savePage } from "@/lib/studio/cms-api";
import { createStudioConfig, type StudioMetadata } from "@/lib/studio/config";
import { layoutToPuck, puckToLayout } from "@/lib/studio/convert";
import { puckDictionaryId, studioStrings, type StudioLang, type StudioStrings } from "@/lib/studio/strings";
import type { Footer, Navigation, Page, User } from "@/types/cms";

const usePuck = createUsePuck();

const VIEWPORTS: Record<"desktop" | "tablet" | "mobile", number> = { desktop: 1440, tablet: 768, mobile: 375 };

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

// ── Icons (inline, 18px, currentColor) ──────────────────────────────────
const Icon = {
  grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5M3 16l9 5 9-5" />,
  desktop: <path d="M3 5h18v11H3zM8 20h8M12 16v4" />,
  tablet: <path d="M6 3h12v18H6zM11 18h2" />,
  mobile: <path d="M8 3h8v18H8zM11 18h2" />,
  undo: <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
  redo: <path d="m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3" />,
  back: <path d="M15 18 9 12l6-6" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
};

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

// ── Top bar (inside Puck context) ───────────────────────────────────────
function TopBar({
  props,
  s,
  dirty,
  status,
  onSave,
  onSwitch,
}: {
  props: StudioEditorProps;
  s: StudioStrings;
  dirty: boolean;
  status: Status;
  onSave: (publish: boolean) => void;
  onSwitch: (param: "locale" | "ui", value: string) => { href: string; onClick: (e: React.MouseEvent) => void };
}) {
  const dispatch = usePuck((p) => p.dispatch);
  const viewports = usePuck((p) => p.appState.ui.viewports);
  const history = usePuck((p) => p.history);
  const width = viewports.current.width;

  const setViewport = (w: number) =>
    dispatch({ type: "setUi", ui: { viewports: { ...viewports, current: { width: w, height: "auto" } } } });

  const pagePath = `/${props.locale}${props.page.slug === "home" ? "" : `/${props.page.slug}`}`;
  const saving = status.kind === "saving";

  return (
    <header className="studio-topbar studio-glass">
      <div className="studio-topbar__title">
        <span className="studio-muted">{s.pages} /</span>
        <strong>{props.page.title}</strong>
        <span className={`studio-dot${dirty ? " is-dirty" : ""}`} title={dirty ? s.unsaved : s.upToDate} />
      </div>

      <div className="studio-segment" role="group" aria-label={s.contentLanguage} title={s.structureShared}>
        {locales.map((code) => (
          <a
            key={code}
            {...onSwitch("locale", code)}
            className={code === props.locale ? "is-active" : ""}
            aria-current={code === props.locale ? "true" : undefined}
            title={localeNames[code]}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>

      <div className="studio-segment studio-segment--icons" role="group">
        {(Object.keys(VIEWPORTS) as (keyof typeof VIEWPORTS)[]).map((key) => (
          <button
            key={key}
            type="button"
            title={s[key]}
            aria-label={s[key]}
            aria-pressed={width === VIEWPORTS[key]}
            className={width === VIEWPORTS[key] ? "is-active" : ""}
            onClick={() => setViewport(VIEWPORTS[key])}
          >
            <Svg>{Icon[key]}</Svg>
          </button>
        ))}
      </div>

      <div className="studio-topbar__spacer" />

      <div className="studio-segment studio-segment--icons">
        <button type="button" title={s.undo} aria-label={s.undo} disabled={!history.hasPast} onClick={history.back}>
          <Svg>{Icon.undo}</Svg>
        </button>
        <button type="button" title={s.redo} aria-label={s.redo} disabled={!history.hasFuture} onClick={history.forward}>
          <Svg>{Icon.redo}</Svg>
        </button>
      </div>

      <a className="studio-btn studio-btn--ghost" href={pagePath} target="_blank" rel="noopener noreferrer">
        <Svg>{Icon.external}</Svg>
        {s.viewSite}
      </a>
      <button type="button" className="studio-btn studio-btn--ghost" disabled={saving} onClick={() => onSave(false)}>
        {saving ? s.saving : s.saveDraft}
      </button>
      <button type="button" className="studio-btn studio-btn--primary" disabled={saving} onClick={() => onSave(true)}>
        <Svg>{Icon.sparkle}</Svg>
        {s.publish}
      </button>

      <div className="studio-segment" role="group" aria-label={s.uiLanguage}>
        {(["id", "en"] as const).map((code) => (
          <a
            key={code}
            {...onSwitch("ui", code)}
            className={code === props.uiLang ? "is-active" : ""}
            aria-current={code === props.uiLang ? "true" : undefined}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>
    </header>
  );
}

function SelectedTitle({ s }: { s: StudioStrings }) {
  const selected = usePuck((p) => p.selectedItem);
  const config = usePuck((p) => p.config);
  const label = selected ? config.components[selected.type]?.label ?? selected.type : null;
  return (
    <div className="studio-panel__head">
      <h2>{s.properties}</h2>
      {label ? <span className="studio-chip">{label}</span> : <p className="studio-muted">{s.selectHint}</p>}
    </div>
  );
}

// ── Editor ──────────────────────────────────────────────────────────────
export function StudioEditor(props: StudioEditorProps) {
  const { page, locale, uiLang, cmsUrl, siteData, chrome, dictionary, fontClass, user } = props;
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
      { width: VIEWPORTS.desktop, label: s.desktop, icon: "Monitor" },
      { width: VIEWPORTS.tablet, label: s.tablet, icon: "Tablet" },
      { width: VIEWPORTS.mobile, label: s.mobile, icon: "Smartphone" },
    ],
    [s],
  );

  const savedRef = useRef(JSON.stringify(page.layout));
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [leftTab, setLeftTab] = useState<"components" | "outline">("components");

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

  const onChange = useCallback((data: Data) => {
    setDirty(JSON.stringify(puckToLayout(data)) !== savedRef.current);
  }, []);

  /** Language switches are plain links to the same page with a different query (confirm if unsaved). */
  const onSwitch = (param: "locale" | "ui", value: string) => {
    const next = new URLSearchParams(searchParams?.toString());
    next.set(param, value);
    return {
      href: `?${next}`,
      onClick: (e: React.MouseEvent) => {
        if (dirty && !window.confirm(s.switchLangConfirm)) e.preventDefault();
        else setDirty(false);
      },
    };
  };

  return (
    <Puck
      config={config}
      data={initialData}
      metadata={metadata}
      viewports={viewports}
      iframe={{ enabled: true, waitForStyles: true }}
      dictionary={uiLang === "id" ? puckDictionaryId : undefined}
      onChange={onChange}
    >
      <SaveBridge
        page={page}
        locale={locale}
        cmsUrl={cmsUrl}
        s={s}
        onStatus={setStatus}
        onSaved={(layoutJson) => {
          savedRef.current = layoutJson;
          setDirty(false);
        }}
      >
        {(onSave) => (
          <div className="studio">
            <aside className="studio-sidebar studio-glass">
              <div className="studio-brand">
                <span className="studio-brand__mark" aria-hidden>
                  ✳
                </span>
                <span>{s.studio}</span>
              </div>
              <div className="studio-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={leftTab === "components"} onClick={() => setLeftTab("components")}>
                  <Svg>{Icon.grid}</Svg>
                  {s.components}
                </button>
                <button type="button" role="tab" aria-selected={leftTab === "outline"} onClick={() => setLeftTab("outline")}>
                  <Svg>{Icon.layers}</Svg>
                  {s.outline}
                </button>
              </div>
              <div className="studio-sidebar__body">{leftTab === "components" ? <Puck.Components /> : <Puck.Outline />}</div>
              <div className="studio-sidebar__footer">
                <p className="studio-note">{s.structureShared}</p>
                <a className="studio-btn studio-btn--ghost w-full" href={`${cmsUrl}/admin/collections/pages/${page.id}`}>
                  <Svg>{Icon.back}</Svg>
                  {s.backToCms}
                </a>
                <div className="studio-user">
                  <span className="studio-user__avatar" aria-hidden>
                    {(user.name || user.email).slice(0, 1).toUpperCase()}
                  </span>
                  <span className="studio-user__name">{user.name || user.email}</span>
                </div>
              </div>
            </aside>

            <div className="studio-main">
              <TopBar props={props} s={s} dirty={dirty} status={status} onSave={onSave} onSwitch={onSwitch} />
              {status.kind === "success" || status.kind === "error" ? (
                <div role={status.kind === "error" ? "alert" : "status"} className={`studio-toast is-${status.kind}`}>
                  {status.message}
                </div>
              ) : null}
              <div className="studio-canvas studio-glass">
                <Puck.Preview />
              </div>
            </div>

            <aside className="studio-panel studio-glass">
              <SelectedTitle s={s} />
              <div className="studio-panel__body">
                <Puck.Fields />
              </div>
            </aside>
          </div>
        )}
      </SaveBridge>
    </Puck>
  );
}

/** Reads the latest editor state at click time and saves it to the CMS. */
function SaveBridge({
  page,
  locale,
  cmsUrl,
  s,
  onStatus,
  onSaved,
  children,
}: {
  page: StudioEditorProps["page"];
  locale: Locale;
  cmsUrl: string;
  s: StudioStrings;
  onStatus: (status: Status) => void;
  onSaved: (layoutJson: string) => void;
  children: (onSave: (publish: boolean) => void) => React.ReactNode;
}) {
  const getPuck = useGetPuck();

  const onSave = async (publish: boolean) => {
    const layout = puckToLayout(getPuck().appState.data);
    onStatus({ kind: "saving" });
    try {
      await savePage(cmsUrl, page.id, layout, { locale, publish });
      onSaved(JSON.stringify(layout));
      onStatus({ kind: "success", message: publish ? s.published : s.saved });
    } catch (error) {
      const status = error instanceof StudioApiError ? error.status : 0;
      const message =
        status === 401 ? s.sessionExpired : status === 403 ? s.forbidden : (error as Error).message || "Error";
      onStatus({ kind: "error", message });
    }
  };

  return <>{children(onSave)}</>;
}
