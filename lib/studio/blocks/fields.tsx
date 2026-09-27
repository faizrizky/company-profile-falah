"use client";

import type { Field, Fields } from "@puckeditor/core";

import type { SiteData } from "@/components/blocks/types";
import { LinkPickerField, MediaField, RelationField, TagsField } from "@/components/studio/fields";
import { mediaUrl } from "@/lib/cms/media";
import type { LinkGroup } from "@/lib/studio/load";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";
import type { Certification, Partner } from "@/types/cms";

import type { AnyProps } from "./metadata";

export type StudioContext = {
  lang: StudioLang;
  locale: string;
  cmsUrl: string;
  data: SiteData;
  pageId: number;
  embedded: boolean;
  linkGroups: LinkGroup[];
};

/** Field builders for the editor's forms, in the editor's language. */
export function createFields({ lang, cmsUrl, data, linkGroups }: StudioContext) {
  const s = studioStrings[lang];
  const L = (en: string, id: string) => (lang === "id" ? id : en);
  const rowId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 24);

  // ── Field builders (mirror the CMS schema) ─────────────────────────────
  // Copy fields are editable directly on the canvas (click the text and type);
  // links, URLs and short technical values stay form-only.
  const text = (en: string, id: string): Field => ({ type: "text", label: L(en, id), contentEditable: true });
  const textarea = (en: string, id: string): Field => ({ type: "textarea", label: L(en, id), contentEditable: true });
  const plain = (en: string, id: string): Field => ({ type: "text", label: L(en, id) });
  /** Where a button/card leads: picked from a list, not typed. */
  const link = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => (
      <LinkPickerField label={field.label ?? ""} value={value} onChange={onChange} groups={linkGroups} s={s} />
    ),
  });
  const number = (en: string, id: string): Field => ({ type: "number", label: L(en, id), min: 0 });
  const select = (en: string, id: string, options: [string, string, string][]): Field => ({
    type: "select",
    label: L(en, id),
    options: options.map(([value, oe, oi]) => ({ value, label: L(oe, oi) })),
  });
  const radio = (en: string, id: string, options: [string, string, string][]): Field => ({
    ...select(en, id, options),
    type: "radio",
  } as Field);
  const toggle = (en: string, id: string): Field => ({
    type: "radio",
    label: L(en, id),
    options: [
      { value: true, label: L("Yes", "Ya") },
      { value: false, label: L("No", "Tidak") },
    ],
  });
  const image = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => (
      <MediaField label={field.label ?? ""} value={value} onChange={onChange} cmsUrl={cmsUrl} s={s} />
    ),
  });
  const video = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => (
      <MediaField label={field.label ?? ""} value={value} onChange={onChange} cmsUrl={cmsUrl} s={s} kind="video" />
    ),
  });
  const tags = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => <TagsField label={field.label ?? ""} value={value} onChange={onChange} s={s} />,
  });
  const partnersField = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => (
      <RelationField<Partner>
        label={field.label ?? ""}
        value={value}
        onChange={onChange}
        options={data.partners}
        createHref={`${cmsUrl}/admin/collections/partners/create`}
        toOption={(p) => ({ id: p.id, label: p.name, image: mediaUrl(p.logo) })}
        s={s}
      />
    ),
  });
  const certificationsField = (en: string, id: string): Field => ({
    type: "custom",
    label: L(en, id),
    render: ({ field, value, onChange }) => (
      <RelationField<Certification>
        label={field.label ?? ""}
        value={value}
        onChange={onChange}
        options={data.certifications}
        createHref={`${cmsUrl}/admin/collections/certifications/create`}
        toOption={(c) => ({ id: c.id, label: c.title, image: mediaUrl(c.icon) })}
        s={s}
      />
    ),
  });
  const align = () => radio("Alignment", "Perataan", [["left", "Left", "Kiri"], ["center", "Center", "Tengah"], ["right", "Right", "Kanan"]]);
  const style = () => select("Style", "Gaya", [["fill", "Fill", "Penuh"], ["stroke", "Outline", "Garis"]]);
  const header = (): Field => ({
    type: "object",
    label: L("Section heading", "Judul section"),
    objectFields: {
      eyebrow: text("Label (pill)", "Label kecil (pill)"),
      title: textarea("Title", "Judul"),
      description: textarea("Description", "Deskripsi"),
    },
  });
  const buttons = (max = 4): Field => ({
    type: "array",
    label: L("Buttons", "Tombol"),
    max,
    getItemSummary: (item: AnyProps) => String(item.label || "…"),
    defaultItemProps: () => ({ id: rowId(), label: L("Request Consultation", "Ajukan Konsultasi"), href: "/contact", style: "fill" }),
    arrayFields: { label: text("Label", "Label"), href: link("Link", "Link"), style: style() },
  });
  const list = (en: string, id: string, arrayFields: Fields, summaryKey: string, defaults: AnyProps, max?: number): Field => ({
    type: "array",
    label: L(en, id),
    max,
    getItemSummary: (item: AnyProps) => String(item[summaryKey] || "…"),
    // Rows get an id up front so React keys and CMS translations stay stable.
    defaultItemProps: () => ({ id: rowId(), ...defaults }),
    arrayFields,
  });
  const headerDefaults = {
    eyebrow: L("Label", "Label"),
    title: L("Section title", "Judul section"),
    description: L("A short description of this section.", "Deskripsi singkat section ini."),
  };

  return {
    s,
    data,
    L,
    rowId,
    text,
    textarea,
    plain,
    link,
    number,
    select,
    radio,
    toggle,
    image,
    video,
    tags,
    partnersField,
    certificationsField,
    align,
    style,
    header,
    buttons,
    list,
    headerDefaults,
  };
}

export type StudioFields = ReturnType<typeof createFields>;
