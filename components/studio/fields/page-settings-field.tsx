"use client";

import { FieldLabel } from "@puckeditor/core";

import type { StudioStrings } from "@/lib/studio/strings";

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
