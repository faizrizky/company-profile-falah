"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  Button,
  Puck,
  useGetPuck,
  type Config,
  type Data,
  type Metadata,
  type Permissions,
  type Viewports,
} from "@puckeditor/core";
import { ExternalLink, Save } from "lucide-react";

import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { type SaveStage, type StudioCollection, StudioApiError, saveDocumentWithProgress } from "@/lib/studio/cms-api";
import { puckDictionaryId, studioStrings, type StudioLang, type StudioStrings } from "@/lib/studio/strings";
import { StudioFieldCollapse } from "./field-collapse";
import { signalStudioReady } from "./ready-signal";
import { useTutorialBridge } from "./tutorial-bridge";

const VIEWPORTS = { desktop: 1440, tablet: 768, mobile: 375 } as const;
const IFRAME = { enabled: true, waitForStyles: true };

/** What the CMS is doing at each save stage, [English, Indonesian]. */
const STAGE_TEXT: Record<SaveStage, [string, string]> = {
  sending: ["Sending changes", "Mengirim perubahan"],
  received: ["Received by the CMS", "Diterima CMS"],
  preparing: ["Preparing the data", "Menyiapkan data"],
  writing: ["Checking and saving", "Memeriksa dan menyimpan"],
  saved: ["Saved to the database", "Tersimpan di database"],
  revalidating: ["Updating the website", "Memperbarui website"],
};

type Status =
  | { kind: "idle" }
  | { kind: "saving"; publish: boolean }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

/**
 * What the shell needs to edit one CMS document (a page, a solution category,
 * a product): the Puck setup, how its data becomes a CMS save, and where its
 * live page is. Built by the adapters (studio-editor, category-editor,
 * product-editor).
 */
export type StudioDocument = {
  collection: StudioCollection;
  id: number;
  title: string;
  /** "draft": the loaded version differs from the live one. */
  status: "draft" | "published" | null | undefined;
  config: Config;
  metadata: Metadata;
  initialData: Data;
  /** Serialises what a save would send, to tell whether anything changed. */
  snapshot: (data: Data) => string;
  /** The snapshot of the document as loaded. */
  initialSnapshot: string;
  /** The body of a save (the document's fields, in the editor's language). */
  changes: (data: Data) => Record<string, unknown>;
  /** The live page, e.g. "/en/solution/x"; null when it has none. */
  livePath: (locale: string) => string | null;
  /** What the editor may do with the items (a fixed layout forbids moving, adding and removing). */
  permissions?: Partial<Permissions>;
  /** The blocks / outline panel on the left (default: shown when the window is wide enough). */
  leftPanel?: boolean;
};

export type StudioShellProps = {
  document: StudioDocument;
  locale: Locale;
  uiLang: StudioLang;
  embedded: boolean;
  cmsUrl: string;
};

type SaveFn = (data: Data, publish: boolean) => Promise<void>;

/** Header controls next to Puck's Publish button — kept to the same few as the Puck demo. */
function HeaderActions({
  children,
  props,
  s,
  saving,
  canPublish,
  onSave,
}: {
  children: ReactNode;
  props: StudioShellProps;
  s: StudioStrings;
  saving: boolean;
  /** Something to publish: unsaved edits, or a saved draft newer than the live page. */
  canPublish: boolean;
  onSave: SaveFn;
}) {
  const getPuck = useGetPuck();
  const pagePath = props.document.livePath(props.locale);

  const switchContentLanguage = (locale: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("locale", locale);
    window.location.search = params.toString();
  };

  return (
    <div className="studio-actions">
      <label className="studio-select" title={`${s.contentLanguage} — ${s.structureShared}`}>
        <span className="sr-only">{s.contentLanguage}</span>
        <select
          value={props.locale}
          onChange={(e) => switchContentLanguage(e.target.value)}
          aria-label={s.contentLanguage}
        >
          {locales.map((code) => (
            <option key={code} value={code} title={localeNames[code]}>
              {code.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      {/* Labels collapse to icons on narrow screens (see studio.css). */}
      {pagePath && (
        <Button variant="secondary" href={pagePath} newTab icon={<ExternalLink size={16} />}>
          <span className="studio-label">{s.viewSite}</span>
        </Button>
      )}
      <Button
        variant="secondary"
        disabled={saving}
        icon={<Save size={16} />}
        onClick={() => onSave(getPuck().appState.data, false)}
      >
        <span className="studio-label">{saving ? s.saving : s.saveDraft}</span>
      </Button>
      {/* Puck's Publish button: locked while a save is in flight (no double
          submit), and when there is nothing to publish. */}
      {saving ? (
        <span className="studio-busy" aria-disabled>
          {children}
        </span>
      ) : !canPublish ? (
        <span className="studio-locked" aria-disabled title={s.nothingToPublish}>
          {children}
        </span>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * Some browser extensions inject scripts into every frame and can make Puck's
 * preview iframe (a srcdoc frame) reload. Puck keeps rendering into the
 * discarded document, so the canvas turns blank for good. Detect that reload
 * and ask for a remount; capped so a misbehaving extension can't loop it.
 */
function usePreviewFrameGuard(onLost: () => void, generation: number) {
  const recoveries = useRef<number[]>([]);
  useEffect(() => {
    let firstLoadSeen = false;
    const onLoad = (event: Event) => {
      const frame = event.target;
      if (!(frame instanceof HTMLIFrameElement) || frame.id !== "preview-frame") return;
      if (!firstLoadSeen) {
        firstLoadSeen = true; // Puck's own initial load
        return;
      }
      requestAnimationFrame(() => {
        if (frame.contentDocument?.getElementById("frame-root")?.childElementCount) return;
        const now = Date.now();
        recoveries.current = recoveries.current.filter((t) => now - t < 30_000);
        if (recoveries.current.length >= 5) return;
        recoveries.current.push(now);
        console.warn(
          "[studio] Preview frame was reloaded by an external script (browser extension?); remounting the editor.",
        );
        onLost();
      });
    };
    // `load` doesn't bubble, but it can be caught while capturing.
    document.addEventListener("load", onLoad, true);
    return () => document.removeEventListener("load", onLoad, true);
  }, [onLost, generation]);
}

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Puck is client-only by nature (initial layout depends on the window size,
 * ids feed its drag & drop registry). Adapters render it after hydration, so
 * the server and client trees stay identical and no ids get out of sync.
 */
export function StudioShell(props: StudioShellProps) {
  const { document: doc, locale, uiLang, embedded, cmsUrl } = props;
  // The CMS tutorial can highlight (and pick) elements of this editor.
  useTutorialBridge(cmsUrl, embedded);
  const s = studioStrings[uiLang];

  const viewports = useMemo<Viewports>(
    () => [
      { width: VIEWPORTS.mobile, label: s.mobile, icon: "Smartphone" },
      { width: VIEWPORTS.tablet, label: s.tablet, icon: "Tablet" },
      { width: VIEWPORTS.desktop, label: s.desktop, icon: "Monitor" },
    ],
    [s],
  );

  // Panels by editor width: both on desktop, just the blocks panel on
  // tablets, none on small tablets (the canvas keeps the room; panels open
  // from the header icons), and Puck's own phone layout below 638px.
  const initialUi = useMemo(() => {
    const width = window.innerWidth;
    if (width < 638) return undefined;
    return {
      leftSideBarVisible: doc.leftPanel !== false && width >= 760,
      rightSideBarVisible: width >= 1000,
      viewports: {
        current: { width: VIEWPORTS.desktop, height: "auto" as const },
        controlsVisible: true,
        options: [],
      },
    };
  }, [doc.leftPanel]);

  // Latest editor data, so a remount (see usePreviewFrameGuard) keeps edits.
  const initialData = doc.initialData;
  const latestData = useRef<Data>(initialData);
  const [generation, setGeneration] = useState(0);
  const remount = useCallback(() => setGeneration((g) => g + 1), []);
  usePreviewFrameGuard(remount, generation);

  // Once Puck's canvas has loaded its styles, tell the CMS to drop its skeleton.
  useEffect(() => {
    let done = false;
    const signal = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      window.clearTimeout(fallback);
      signalStudioReady(cmsUrl);
    };
    const check = () => {
      if (document.querySelector('[class*="_PuckCanvas--ready"]')) signal();
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    const fallback = window.setTimeout(signal, 8000);
    check();
    return () => {
      done = true;
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [cmsUrl]);

  const savedRef = useRef(doc.initialSnapshot);
  const [dirty, setDirty] = useState(false);
  // The loaded page is the latest draft; "draft" means it differs from the live page.
  const [draftPending, setDraftPending] = useState(doc.status === "draft");
  const canPublish = dirty || draftPending;
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Leaving with unsaved changes (closing, switching language) asks first.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Real save progress: bytes sent, then each stage the CMS reports as it
  // reaches it (preparing, checking and saving, website refresh).
  const [progress, setProgress] = useState<{ stage: SaveStage; pct: number }>({ stage: "sending", pct: 0 });
  // Inside the CMS the CMS page runs the save and shows the toast (it stays up
  // across tab switches); this editor only shows its own when saving itself.
  const [ownToast, setOwnToast] = useState(true);

  useEffect(() => {
    if (status.kind !== "success") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  const onChange = useCallback(
    (data: Data) => {
      latestData.current = data;
      setDirty(doc.snapshot(data) !== savedRef.current);
    },
    [doc],
  );

  const save: SaveFn = async (data, publish) => {
    const changes = doc.changes(data);
    const snapshot = doc.snapshot(data);
    if (status.kind === "saving") return;
    setStatus({ kind: "saving", publish });
    setProgress({ stage: "sending", pct: 0 });
    const inCms = window.parent !== window;
    let savingHere = !inCms;
    setOwnToast(savingHere);
    try {
      const { handedOver } = await saveDocumentWithProgress(
        cmsUrl,
        { collection: doc.collection, id: doc.id },
        changes,
        { locale, publish },
        (stage, pct) => {
          savingHere = true;
          setOwnToast(true);
          setProgress((p) => (pct > p.pct ? { stage, pct } : p));
        },
      );
      savedRef.current = snapshot;
      setDirty(false);
      setDraftPending(!publish);
      if (handedOver) {
        setStatus({ kind: "idle" });
        return;
      }
      setProgress({ stage: "saved", pct: 100 });
      // Let the full bar show before the result replaces it.
      await new Promise((r) => setTimeout(r, 300));
      setStatus({ kind: "success", message: publish ? s.published : s.saved });
    } catch (error) {
      const code = error instanceof StudioApiError ? error.status : 0;
      const message =
        code === 401 ? s.sessionExpired : code === 403 ? s.forbidden : (error as Error).message || "Error";
      // A save the CMS ran and answered: it already shows the error. Anything
      // else (a failure here, before the hand-over) must not vanish silently.
      if (!savingHere && error instanceof StudioApiError && code !== 0) {
        setStatus({ kind: "idle" });
      } else {
        setOwnToast(true);
        setStatus({ kind: "error", message });
      }
    }
  };

  return (
    // Inside the CMS the editor sheds its own chrome (title, coloured rail,
    // backdrop) so it reads as part of the admin page — see studio.css.
    <div className={embedded ? "studio-embedded" : "studio-standalone"}>
      <Puck
        key={generation}
        config={doc.config}
        data={generation === 0 ? initialData : latestData.current}
        metadata={doc.metadata}
        ui={initialUi}
        viewports={viewports}
        iframe={IFRAME}
        permissions={doc.permissions}
        dictionary={uiLang === "id" ? puckDictionaryId : undefined}
        headerTitle={embedded ? "" : doc.title}
        headerPath={embedded ? "" : (doc.livePath(locale) ?? "")}
        onChange={onChange}
        onPublish={(data) => (canPublish ? save(data, true) : undefined)}
        overrides={{
          headerActions: ({ children }) => (
            <HeaderActions props={props} s={s} saving={status.kind === "saving"} canPublish={canPublish} onSave={save}>
              {children}
            </HeaderActions>
          ),
        }}
      />
      <StudioFieldCollapse />
      {/* Toast in the CMS's style (bottom right), shown from the click on:
          saving can take a few seconds. */}
      {status.kind !== "idle" && ownToast ? (
        <div
          key={status.kind}
          role={status.kind === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`studio-toast is-${status.kind}`}
        >
          <span className="studio-toast__icon" aria-hidden>
            {status.kind === "saving" ? <span className="studio-spinner" /> : status.kind === "success" ? "✓" : "!"}
          </span>
          <span className="studio-toast__body">
            <span className="studio-toast__row">
              <span>{status.kind === "saving" ? (status.publish ? s.publishing : s.savingDraft) : status.message}</span>
              {status.kind === "saving" && <span className="studio-toast__pct">{Math.round(progress.pct)}%</span>}
            </span>
            {status.kind === "saving" && (
              <>
                <span
                  className="studio-toast__bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress.pct)}
                >
                  <span style={{ width: `${progress.pct}%` }} />
                </span>
                <span className="studio-toast__stage">{STAGE_TEXT[progress.stage][uiLang === "id" ? 1 : 0]}</span>
              </>
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
}
