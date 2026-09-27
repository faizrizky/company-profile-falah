"use client";

import type { ComponentConfig, Field, Fields } from "@puckeditor/core";

import { COLUMN_KEYS, LayoutSectionView } from "@/components/blocks/LayoutSection";
import {
  BadgeView,
  ButtonView,
  CardView,
  ElementFrame,
  HeadingView,
  ImageView,
  ParagraphView,
  SpacerView,
} from "@/components/blocks/elements";
import { ELEMENT_TYPES } from "@/lib/studio/convert";

import type { StudioFields } from "./fields";
import type { AnyProps } from "./metadata";

/** The free-form layout section and the elements that go in its columns. */
export function layoutComponents(f: StudioFields): Record<string, ComponentConfig<AnyProps>> {
  const { text, textarea, link, select, radio, toggle, image, align, style, L } = f;

  return {
    // ── Layout ───────────────────────────────────────────────────────────
    layoutSection: {
      label: L("Layout section (columns)", "Section bebas (kolom)"),
      fields: {
        columns: radio("Columns", "Kolom", [
          ["1", "1", "1"],
          ["2", "2", "2"],
          ["3", "3", "3"],
          ["4", "4", "4"],
        ]),
        verticalAlign: radio("Vertical alignment", "Perataan vertikal", [
          ["start", "Top", "Atas"],
          ["center", "Center", "Tengah"],
        ]),
        gap: radio("Spacing", "Jarak", [
          ["sm", "S", "K"],
          ["md", "M", "S"],
          ["lg", "L", "B"],
        ]),
        background: select("Background", "Latar belakang", [
          ["dark", "Dark", "Gelap"],
          ["darker", "Darker", "Lebih gelap"],
          ["gradient", "Brand gradient", "Gradasi brand"],
          ["image", "Image", "Gambar"],
        ]),
        backgroundImage: image("Background image", "Gambar latar"),
        padding: radio("Padding", "Padding", [
          ["sm", "S", "K"],
          ["md", "M", "S"],
          ["lg", "L", "B"],
        ]),
        width: radio("Width", "Lebar", [
          ["narrow", "Narrow", "Sempit"],
          ["default", "Default", "Standar"],
          ["wide", "Wide", "Lebar"],
        ]),
        ...Object.fromEntries(
          COLUMN_KEYS.map((key, i) => [
            key,
            { type: "slot", label: `${L("Column", "Kolom")} ${i + 1}`, allow: ELEMENT_TYPES } satisfies Field,
          ]),
        ),
      },
      resolveFields: (item, { fields }) => {
        const count = Number(item.props.columns ?? 2);
        const visible = { ...(fields as Fields<AnyProps>) };
        COLUMN_KEYS.forEach((key, i) => {
          if (i >= count) delete visible[key];
        });
        if (item.props.background !== "image") delete visible.backgroundImage;
        return visible;
      },
      defaultProps: {
        columns: "2",
        verticalAlign: "center",
        gap: "md",
        background: "dark",
        padding: "md",
        width: "default",
        column1: [],
        column2: [],
        column3: [],
        column4: [],
      },
      render: ({ puck: _puck, id, editMode: _editMode, ...props }) => {
        const slots = COLUMN_KEYS.map((key) => {
          const Slot = props[key] as
            ((p?: { className?: string; minEmptyHeight?: number }) => React.ReactNode) | undefined;
          return Slot ? <Slot key={key} className="flex min-h-16 flex-col gap-4" minEmptyHeight={96} /> : null;
        });
        return <LayoutSectionView block={{ ...props, id, blockType: "layoutSection" } as never} columns={slots} />;
      },
    },

    // ── Elements (inside columns only) ───────────────────────────────────
    badge: {
      label: "Badge",
      fields: { text: text("Text", "Teks"), align: align() },
      defaultProps: { text: L("New", "Baru"), align: "left" },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <BadgeView el={{ ...props, blockType: "badge" } as never} />
        </ElementFrame>
      ),
    },
    heading: {
      label: L("Heading", "Judul"),
      fields: {
        text: textarea("Text", "Teks"),
        level: radio("Level", "Level", [
          ["h1", "H1", "H1"],
          ["h2", "H2", "H2"],
          ["h3", "H3", "H3"],
          ["h4", "H4", "H4"],
        ]),
        size: radio("Size", "Ukuran", [
          ["sm", "S", "K"],
          ["md", "M", "S"],
          ["lg", "L", "B"],
          ["xl", "XL", "XL"],
        ]),
        color: radio("Color", "Warna", [
          ["accent", "Light blue", "Biru muda"],
          ["white", "White", "Putih"],
        ]),
        align: align(),
      },
      defaultProps: { text: L("Heading", "Judul"), level: "h2", size: "lg", color: "accent", align: "left" },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <HeadingView el={{ ...props, blockType: "heading" } as never} />
        </ElementFrame>
      ),
    },
    paragraph: {
      label: L("Paragraph", "Paragraf"),
      fields: {
        text: textarea("Text", "Teks"),
        size: radio("Size", "Ukuran", [
          ["sm", "S", "K"],
          ["base", "M", "S"],
          ["lg", "L", "B"],
        ]),
        tone: radio("Tone", "Warna", [
          ["default", "White", "Putih"],
          ["muted", "Muted", "Redup"],
        ]),
        align: align(),
      },
      defaultProps: {
        text: L("Write something meaningful here.", "Tulis sesuatu yang bermakna di sini."),
        size: "base",
        tone: "default",
        align: "left",
      },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <ParagraphView el={{ ...props, blockType: "paragraph" } as never} />
        </ElementFrame>
      ),
    },
    image: {
      label: L("Image", "Gambar"),
      fields: {
        image: image("Image", "Gambar"),
        aspect: radio("Aspect ratio", "Rasio", [
          ["video", "16:9", "16:9"],
          ["landscape", "4:3", "4:3"],
          ["square", "1:1", "1:1"],
          ["portrait", "3:4", "3:4"],
        ]),
        framed: toggle("Glow frame", "Bingkai glow"),
        caption: text("Caption", "Keterangan"),
      },
      defaultProps: { aspect: "video", framed: true },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <ImageView el={{ ...props, blockType: "image" } as never} />
        </ElementFrame>
      ),
    },
    button: {
      label: L("Button", "Tombol"),
      fields: { label: text("Label", "Label"), href: link("Link", "Link"), style: style(), align: align() },
      defaultProps: {
        label: L("Request Consultation", "Ajukan Konsultasi"),
        href: "/contact",
        style: "fill",
        align: "left",
      },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <ButtonView el={{ ...props, blockType: "button" } as never} />
        </ElementFrame>
      ),
    },
    card: {
      label: L("Card", "Kartu"),
      fields: {
        icon: image("Icon", "Ikon"),
        title: text("Title", "Judul"),
        description: textarea("Description", "Deskripsi"),
        href: link("Link (optional)", "Link (opsional)"),
      },
      defaultProps: {
        title: L("Card title", "Judul kartu"),
        description: L("Short supporting text.", "Teks pendukung singkat."),
      },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <CardView el={{ ...props, blockType: "card" } as never} />
        </ElementFrame>
      ),
    },
    spacer: {
      label: L("Spacer", "Jarak"),
      fields: {
        size: radio("Size", "Ukuran", [
          ["sm", "S", "K"],
          ["md", "M", "S"],
          ["lg", "L", "B"],
          ["xl", "XL", "XL"],
        ]),
      },
      defaultProps: { size: "md" },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <SpacerView el={{ ...props, blockType: "spacer" } as never} />
        </ElementFrame>
      ),
    },
  };
}
