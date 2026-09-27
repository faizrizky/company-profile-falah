"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
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
            <input ref={fileRef} type="file" accept={MEDIA_ACCEPT[kind]} hidden onChange={onUpload} />
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
            <button
              type="button"
              className="studio-btn studio-btn--ghost w-full"
              disabled={busy}
              onClick={() => load(page + 1, search)}
            >
              {busy ? s.loading : s.loadMore}
            </button>
          )}
          {busy && items.length === 0 && <p className="studio-muted">{s.loading}</p>}
        </div>
      )}
    </FieldLabel>
  );
}
