"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { FieldLabel } from "@puckeditor/core";

import { listMedia, MEDIA_ACCEPT, uploadMedia, type MediaKind } from "@/lib/studio/cms-api";
import type { StudioStrings } from "@/lib/studio/strings";
import type { Media } from "@/types/cms";

type MediaValue = Media | number | null | undefined;

/** Thumbnail for a media item: the image itself, or the first frame of a video. */
function MediaThumb({ item, alt = "" }: { item: Media; alt?: string }) {
  if (item.mimeType?.startsWith("video/")) {
    return <video src={item.url ?? undefined} muted playsInline preload="metadata" aria-label={alt} />;
  }
  return <img src={item.thumbnailURL || item.url || ""} alt={alt} loading="lazy" />;
}

/** Pick an image or video from the CMS media library, or upload a new one (same validation as the CMS admin). */
export function MediaField({
  label,
  value,
  onChange,
  cmsUrl,
  s,
  kind = "image",
}: {
  label: string;
  value: MediaValue;
  onChange: (value: Media | null) => void;
  cmsUrl: string;
  s: StudioStrings;
  kind?: MediaKind;
}) {
  const isVideo = kind === "video";
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const current = value && typeof value === "object" ? value : null;

  const load = useCallback(
    async (nextPage: number, query: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await listMedia(cmsUrl, { page: nextPage, search: query, kind });
        setItems((prev) => (nextPage === 1 ? res.docs : [...prev, ...res.docs]));
        setHasMore(res.hasNextPage);
        setPage(nextPage);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [cmsUrl, kind],
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => void load(1, search), 250);
    return () => clearTimeout(timer);
  }, [open, search, load]);

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { doc } = await uploadMedia(cmsUrl, file, file.name.replace(/\.[^.]+$/, ""));
      onChange(doc);
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldLabel label={label} el="div">
      <div className="studio-media">
        <div className="studio-media__preview">
          {current?.url ? <MediaThumb item={current} /> : <span>{isVideo ? s.noVideo : s.noImage}</span>}
        </div>
        <div className="studio-media__actions">
          <button type="button" className="studio-btn studio-btn--ghost" onClick={() => setOpen((v) => !v)}>
            {open ? s.close : current ? s.replace : isVideo ? s.chooseVideo : s.choose}
          </button>
          {current && (
            <button type="button" className="studio-btn studio-btn--ghost" onClick={() => onChange(null)}>
              {s.remove}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="studio-media__library">
          <div className="studio-media__toolbar">
            <input
              className="studio-input"
              placeholder={isVideo ? s.searchVideos : s.searchImages}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="studio-btn studio-btn--primary" onClick={() => fileRef.current?.click()}>
              {s.upload}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={MEDIA_ACCEPT[kind]}
              hidden
              onChange={onUpload}
            />
          </div>
          {error && <p className="studio-error">{error}</p>}
          <div className="studio-media__grid">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.alt || item.filename || ""}
                className={`studio-media__item${current?.id === item.id ? " is-active" : ""}`}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <MediaThumb item={item} alt={item.alt || ""} />
              </button>
            ))}
          </div>
          {hasMore && (
            <button type="button" className="studio-btn studio-btn--ghost w-full" disabled={busy} onClick={() => load(page + 1, search)}>
              {busy ? s.loading : s.loadMore}
            </button>
          )}
          {busy && items.length === 0 && <p className="studio-muted">{s.loading}</p>}
        </div>
      )}
    </FieldLabel>
  );
}

/** Chips input for hasMany text fields (tags, roles, dropdown options). */
export function TagsField({
  label,
  value,
  onChange,
  s,
}: {
  label: string;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  s: StudioStrings;
}) {
  const tags = value ?? [];
  const [draft, setDraft] = useState("");

  const add = () => {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <FieldLabel label={label} el="div">
      <div className="studio-tags">
        {tags.map((tag) => (
          <span key={tag} className="studio-tag">
            {tag}
            <button type="button" aria-label={`${s.remove} ${tag}`} onClick={() => onChange(tags.filter((t) => t !== tag))}>
              ×
            </button>
          </span>
        ))}
        <input
          className="studio-tags__input"
          value={draft}
          placeholder={s.addTag}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
        />
      </div>
    </FieldLabel>
  );
}

type Option = { id: number; label: string; image?: string | null };

/** Ordered multi-select for relationship fields (partner logos, certifications). */
export function RelationField<T extends { id: number }>({
  label,
  value,
  onChange,
  options,
  toOption,
  s,
}: {
  label: string;
  value: (number | T)[] | null | undefined;
  onChange: (value: T[]) => void;
  options: T[];
  toOption: (item: T) => Option;
  s: StudioStrings;
}) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const selected = (value ?? [])
    .map((v) => (typeof v === "number" ? byId.get(v) : v))
    .filter((v): v is T => Boolean(v));
  const selectedIds = new Set(selected.map((v) => v.id));

  const move = (index: number, delta: number) => {
    const next = [...selected];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <FieldLabel label={label} el="div">
      <ol className="studio-relation">
        {selected.map((item, i) => {
          const o = toOption(item);
          return (
            <li key={o.id} className="studio-relation__item">
              {o.image && <img src={o.image} alt="" />}
              <span>{o.label}</span>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Up">
                ↑
              </button>
              <button type="button" disabled={i === selected.length - 1} onClick={() => move(i, 1)} aria-label="Down">
                ↓
              </button>
              <button type="button" onClick={() => onChange(selected.filter((x) => x.id !== o.id))} aria-label={s.remove}>
                ×
              </button>
            </li>
          );
        })}
      </ol>
      <select
        className="studio-input"
        value=""
        onChange={(e) => {
          const item = byId.get(Number(e.target.value));
          if (item) onChange([...selected, item]);
        }}
      >
        <option value="">{s.addItem}</option>
        {options
          .filter((o) => !selectedIds.has(o.id))
          .map((o) => {
            const opt = toOption(o);
            return (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            );
          })}
      </select>
    </FieldLabel>
  );
}

/** "Page" panel extras: interface language and (outside the CMS) a way back to it. */
export function PageSettingsField({
  lang,
  locale,
  cmsUrl,
  pageId,
  embedded,
  s,
}: {
  lang: "id" | "en";
  locale: string;
  cmsUrl: string;
  pageId: number;
  embedded: boolean;
  s: StudioStrings;
}) {
  // Built from props (not window.location) so server and client render the same markup.
  const hrefFor = (ui: "id" | "en") =>
    `?${new URLSearchParams({ locale, ui, ...(embedded ? { embed: "1" } : {}) })}`;

  return (
    <div className="studio-settings">
      <FieldLabel label={s.interfaceLanguage} el="div">
        <div className="studio-segment">
          {(["id", "en"] as const).map((code) => (
            <a key={code} href={hrefFor(code)} className={code === lang ? "is-active" : ""} aria-current={code === lang ? "true" : undefined}>
              {code === "id" ? "Indonesia" : "English"}
            </a>
          ))}
        </div>
      </FieldLabel>
      {!embedded && (
        <a className="studio-link" href={`${cmsUrl}/admin/collections/pages/${pageId}/form`}>
          ← {s.backToCms}
        </a>
      )}
      <p className="studio-note">{s.structureShared}</p>
    </div>
  );
}
