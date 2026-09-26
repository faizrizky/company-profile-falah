"use client";

import type { ComponentConfig, Config, Field, Fields } from "@puckeditor/core";

import { blockComponents } from "@/components/blocks/RenderBlocks";
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
import type { BlockContext, SiteData } from "@/components/blocks/types";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MediaField, PageSettingsField, RelationField, TagsField } from "@/components/studio/fields";
import { buildMegaMenu } from "@/lib/cms/mega-menu";
import { asMedia, mediaUrl } from "@/lib/cms/media";
import { ELEMENT_TYPES } from "@/lib/studio/convert";
import { studioStrings, type StudioLang } from "@/lib/studio/strings";
import type { Certification, Footer as FooterData, Navigation, Page, Partner } from "@/types/cms";

/** Everything the canvas needs to render exactly like the live site. */
export type StudioMetadata = {
  ctx: BlockContext;
  fontClass: string;
  chrome: { navigation: Navigation | null; footer: FooterData | null };
};

type Block = Page["layout"][number];
type AnyProps = Record<string, unknown>;

type StudioContext = {
  lang: StudioLang;
  locale: string;
  cmsUrl: string;
  data: SiteData;
  pageId: number;
  embedded: boolean;
};

export function createStudioConfig({ lang, locale, cmsUrl, data, pageId, embedded }: StudioContext): Config {
  const s = studioStrings[lang];
  const L = (en: string, id: string) => (lang === "id" ? id : en);
  const rowId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 24);

  // ── Field builders (mirror the CMS schema) ─────────────────────────────
  // Copy fields are editable directly on the canvas (click the text and type);
  // links, URLs and short technical values stay form-only.
  const text = (en: string, id: string): Field => ({ type: "text", label: L(en, id), contentEditable: true });
  const textarea = (en: string, id: string): Field => ({ type: "textarea", label: L(en, id), contentEditable: true });
  const plain = (en: string, id: string): Field => ({ type: "text", label: L(en, id) });
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
  const buttons = (max = 2): Field => ({
    type: "array",
    label: L("Buttons", "Tombol"),
    max,
    getItemSummary: (item: AnyProps) => String(item.label || "…"),
    defaultItemProps: () => ({ id: rowId(), label: L("Request Consultation", "Ajukan Konsultasi"), href: "/contact", style: "fill" }),
    arrayFields: { label: text("Label", "Label"), href: plain("Link", "Link"), style: style() },
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

  // ── Canvas rendering ───────────────────────────────────────────────────
  const meta = (puck: { metadata: unknown }) => puck.metadata as StudioMetadata;
  const section = <T extends Block["blockType"]>(
    type: T,
    config: Omit<ComponentConfig<AnyProps>, "render">,
  ): ComponentConfig<AnyProps> => ({
    ...config,
    render: ({ puck, id, editMode: _editMode, ...props }) => {
      const Component = blockComponents[type] as unknown as React.ComponentType<{ block: Block; ctx: BlockContext }>;
      return <Component block={{ ...props, id, blockType: type } as unknown as Block} ctx={meta(puck).ctx} />;
    },
  });

  const components: Record<string, ComponentConfig<AnyProps>> = {
    // ── Ready-made sections ──────────────────────────────────────────────
    hero: section("hero", {
      label: "Hero",
      fields: {
        variant: select("Variant", "Varian", [
          ["home", "Home — left aligned + partner logos", "Home — rata kiri + logo partner"],
          ["centered", "Centered", "Rata tengah"],
          ["page", "Page — left aligned with pill", "Halaman — rata kiri dengan pill"],
        ]),
        eyebrow: text("Label (pill)", "Label kecil (pill)"),
        title: textarea("Title", "Judul"),
        description: textarea("Description", "Deskripsi"),
        background: image("Background", "Latar belakang"),
        backgroundMobile: image("Background (mobile)", "Latar belakang (ponsel)"),
        buttons: buttons(),
        showPartners: toggle("Show partner logos", "Tampilkan logo partner"),
        showCertificates: toggle("Show certificate button", "Tampilkan tombol sertifikat"),
        showScrollHint: toggle("Show scroll icon", "Tampilkan ikon scroll"),
      },
      resolveFields: (item, { fields }) => {
        const { eyebrow, showPartners, showCertificates, ...rest } = fields as Fields<AnyProps>;
        const variant = item.props.variant;
        return {
          ...(variant !== "home" ? { eyebrow } : {}),
          ...rest,
          ...(variant === "home" ? { showPartners } : {}),
          ...(variant === "centered" ? { showCertificates } : {}),
        } as Fields<AnyProps>;
      },
      defaultProps: {
        variant: "page",
        eyebrow: L("New section", "Section baru"),
        title: L("Headline for this page", "Judul utama halaman ini"),
        description: L("Supporting sentence that explains the value.", "Kalimat pendukung yang menjelaskan nilainya."),
        buttons: [],
        showScrollHint: true,
      },
    }),
    problemShowcase: section("problemShowcase", {
      label: L("Problem showcase", "Daftar masalah + gambar"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        items: list("Items", "Item", { icon: image("Icon", "Ikon"), title: text("Title", "Judul"), description: textarea("Description", "Deskripsi") }, "title", { title: L("Item", "Item") }, 6),
        image: image("Image", "Gambar"),
      },
      defaultProps: { header: headerDefaults, items: [] },
    }),
    videoShowcase: section("videoShowcase", {
      label: L("Video showcase", "Video showcase"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        poster: image("Video poster", "Gambar video"),
        video: video("Video (MP4 / WebM)", "Video (MP4 / WebM)"),
        captionTitle: text("Caption title", "Judul keterangan"),
        captionDescription: text("Caption text", "Teks keterangan"),
        videoUrl: plain("External video link (if no video above)", "Link video luar (jika video di atas kosong)"),
      },
      defaultProps: { header: headerDefaults },
    }),
    solutionHighlights: section("solutionHighlights", {
      label: L("Solution highlights", "Sorotan solusi"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        featured: {
          type: "object",
          label: L("Featured card", "Kartu utama"),
          objectFields: {
            image: image("Image", "Gambar"),
            title: text("Title", "Judul"),
            description: textarea("Description", "Deskripsi"),
            tagsLabel: text("Tags label", "Label tag"),
            tags: tags("Tags", "Tag"),
            button: { type: "object", label: L("Button", "Tombol"), objectFields: { label: text("Label", "Label"), href: plain("Link", "Link") } },
          },
        },
        items: list("Small cards", "Kartu kecil", { image: image("Image", "Gambar"), title: text("Title", "Judul"), href: plain("Link", "Link") }, "title", { title: L("Card", "Kartu"), href: "/solution" }, 4),
      },
      defaultProps: { header: headerDefaults, featured: { title: L("Featured", "Utama"), tags: [], button: {} }, items: [] },
    }),
    expertise: section("expertise", {
      label: L("Expertise + stats", "Keahlian + statistik"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        stats: list("Stats", "Statistik", { value: number("Value", "Angka"), suffix: plain("Suffix", "Akhiran"), label: text("Label", "Label") }, "label", { value: 10, suffix: "+", label: L("Metric", "Metrik") }, 4),
        cards: list("Cards", "Kartu", { image: image("Image", "Gambar"), icon: image("Icon", "Ikon"), title: text("Title", "Judul"), description: textarea("Description", "Deskripsi") }, "title", { title: L("Card", "Kartu") }, 6),
      },
      defaultProps: { header: headerDefaults, stats: [], cards: [] },
    }),
    featureGrid: section("featureGrid", {
      label: L("Feature grid", "Grid fitur"),
      fields: {
        variant: select("Variant", "Varian", [["cards", "Cards — 3 columns", "Kartu — 3 kolom"], ["values", "Values — 4 columns + quote", "Nilai — 4 kolom + kutipan"]]),
        header: header(),
        background: image("Background", "Latar belakang"),
        backgroundOverlay: image("Background overlay", "Lapisan latar"),
        quote: text("Quote", "Kutipan"),
        items: list("Items", "Item", { icon: image("Icon", "Ikon"), title: text("Title", "Judul"), description: textarea("Description", "Deskripsi") }, "title", { title: L("Feature", "Fitur") }, 8),
      },
      defaultProps: { variant: "cards", header: headerDefaults, items: [] },
    }),
    leadership: section("leadership", {
      label: L("Leadership", "Kepemimpinan"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        leaders: list("People", "Orang", { photo: image("Photo", "Foto"), name: text("Name", "Nama"), roles: tags("Roles", "Jabatan"), bio: textarea("Bio", "Bio") }, "name", { name: L("Name", "Nama"), roles: [] }, 8),
      },
      defaultProps: { header: headerDefaults, leaders: [] },
    }),
    teamStats: section("teamStats", {
      label: L("Team stats", "Statistik tim"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        items: list("Stats", "Statistik", { label: text("Label", "Label"), value: number("Value", "Angka"), suffix: plain("Suffix", "Akhiran") }, "label", { label: L("Team", "Tim"), value: 10, suffix: "+" }, 8),
      },
      defaultProps: { header: headerDefaults, items: [] },
    }),
    partners: section("partners", {
      label: L("Partner logos", "Logo partner"),
      fields: {
        header: header(),
        rowOne: partnersField("Row 1 (moves left)", "Baris 1 (bergerak ke kiri)"),
        rowTwo: partnersField("Row 2 (moves right)", "Baris 2 (bergerak ke kanan)"),
      },
      defaultProps: { header: headerDefaults, rowOne: data.partners.slice(0, 6), rowTwo: [] },
    }),
    certifications: section("certifications", {
      label: L("Certifications", "Sertifikasi"),
      fields: {
        variant: select("Variant", "Varian", [["cards", "Cards", "Kartu"], ["gallery", "Gallery (zoomable)", "Galeri (bisa diperbesar)"]]),
        header: header(),
        background: image("Background", "Latar belakang"),
        items: certificationsField("Certifications (empty = all)", "Sertifikasi (kosong = semua)"),
      },
      defaultProps: { variant: "cards", header: headerDefaults, items: [] },
    }),
    solutionOverview: section("solutionOverview", {
      label: L("Solution overview (tabs)", "Ikhtisar solusi (tab)"),
      fields: { header: header(), background: image("Background", "Latar belakang") },
      defaultProps: { header: headerDefaults },
    }),
    faq: section("faq", {
      label: "FAQ",
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        items: list("Questions", "Pertanyaan", { question: text("Question", "Pertanyaan"), answer: textarea("Answer", "Jawaban") }, "question", { question: L("Question?", "Pertanyaan?"), answer: L("Answer.", "Jawaban.") }, 20),
      },
      defaultProps: { header: headerDefaults, items: [] },
    }),
    workflow: section("workflow", {
      label: L("Workflow steps", "Langkah kerja"),
      fields: {
        header: header(),
        steps: list("Steps", "Langkah", { title: text("Title", "Judul"), description: textarea("Description", "Deskripsi") }, "title", { title: L("Step", "Langkah") }, 8),
      },
      defaultProps: { header: headerDefaults, steps: [] },
    }),
    contactForm: section("contactForm", {
      label: L("Contact form", "Form kontak"),
      fields: {
        eyebrow: text("Label (pill)", "Label kecil (pill)"),
        title: text("Title", "Judul"),
        titleMobile: text("Title (mobile)", "Judul (ponsel)"),
        description: textarea("Description", "Deskripsi"),
        descriptionMobile: textarea("Description (mobile)", "Deskripsi (ponsel)"),
        background: image("Background", "Latar belakang"),
        submitLabel: text("Submit button", "Tombol kirim"),
        responseNote: text("Response note", "Catatan respons"),
        interestOptions: tags("Interest options", "Pilihan minat"),
        whatsappText: textarea("WhatsApp text", "Teks WhatsApp"),
        successMessage: text("Success message", "Pesan sukses"),
      },
      defaultProps: { title: L("Contact us", "Hubungi kami"), interestOptions: [] },
    }),
    officeMap: section("officeMap", {
      label: L("Office map", "Peta kantor"),
      fields: { header: header(), background: image("Background", "Latar belakang") },
      defaultProps: { header: headerDefaults },
    }),
    cta: section("cta", {
      label: L("Call to action", "Ajakan (CTA)"),
      fields: {
        variant: select("Variant", "Varian", [["simple", "Simple", "Sederhana"], ["withMedia", "With media / video", "Dengan media / video"]]),
        header: header(),
        background: image("Background", "Latar belakang"),
        backgroundMobile: image("Background (mobile)", "Latar belakang (ponsel)"),
        buttons: buttons(),
        media: image("Media", "Media"),
        video: video("Video (MP4 / WebM)", "Video (MP4 / WebM)"),
        videoUrl: plain("External video link (if no video above)", "Link video luar (jika video di atas kosong)"),
      },
      resolveFields: (item, { fields }) => {
        const { media, video: _video, videoUrl, ...rest } = fields as Fields<AnyProps>;
        return (item.props.variant === "withMedia" ? fields : rest) as Fields<AnyProps>;
      },
      defaultProps: { variant: "simple", header: headerDefaults, buttons: [] },
    }),

    // ── Layout ───────────────────────────────────────────────────────────
    layoutSection: {
      label: L("Layout section (columns)", "Section bebas (kolom)"),
      fields: {
        columns: radio("Columns", "Kolom", [["1", "1", "1"], ["2", "2", "2"], ["3", "3", "3"], ["4", "4", "4"]]),
        verticalAlign: radio("Vertical alignment", "Perataan vertikal", [["start", "Top", "Atas"], ["center", "Center", "Tengah"]]),
        gap: radio("Spacing", "Jarak", [["sm", "S", "K"], ["md", "M", "S"], ["lg", "L", "B"]]),
        background: select("Background", "Latar belakang", [
          ["dark", "Dark", "Gelap"],
          ["darker", "Darker", "Lebih gelap"],
          ["gradient", "Brand gradient", "Gradasi brand"],
          ["image", "Image", "Gambar"],
        ]),
        backgroundImage: image("Background image", "Gambar latar"),
        padding: radio("Padding", "Padding", [["sm", "S", "K"], ["md", "M", "S"], ["lg", "L", "B"]]),
        width: radio("Width", "Lebar", [["narrow", "Narrow", "Sempit"], ["default", "Default", "Standar"], ["wide", "Wide", "Lebar"]]),
        ...Object.fromEntries(
          COLUMN_KEYS.map((key, i) => [key, { type: "slot", label: `${L("Column", "Kolom")} ${i + 1}`, allow: ELEMENT_TYPES } satisfies Field]),
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
          const Slot = props[key] as ((p?: { className?: string; minEmptyHeight?: number }) => React.ReactNode) | undefined;
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
        level: radio("Level", "Level", [["h1", "H1", "H1"], ["h2", "H2", "H2"], ["h3", "H3", "H3"], ["h4", "H4", "H4"]]),
        size: radio("Size", "Ukuran", [["sm", "S", "K"], ["md", "M", "S"], ["lg", "L", "B"], ["xl", "XL", "XL"]]),
        color: radio("Color", "Warna", [["accent", "Light blue", "Biru muda"], ["white", "White", "Putih"]]),
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
        size: radio("Size", "Ukuran", [["sm", "S", "K"], ["base", "M", "S"], ["lg", "L", "B"]]),
        tone: radio("Tone", "Warna", [["default", "White", "Putih"], ["muted", "Muted", "Redup"]]),
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
        aspect: radio("Aspect ratio", "Rasio", [["video", "16:9", "16:9"], ["landscape", "4:3", "4:3"], ["square", "1:1", "1:1"], ["portrait", "3:4", "3:4"]]),
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
      fields: { label: text("Label", "Label"), href: plain("Link", "Link"), style: style(), align: align() },
      defaultProps: { label: L("Request Consultation", "Ajukan Konsultasi"), href: "/contact", style: "fill", align: "left" },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <ButtonView el={{ ...props, blockType: "button" } as never} />
        </ElementFrame>
      ),
    },
    card: {
      label: L("Card", "Kartu"),
      fields: { icon: image("Icon", "Ikon"), title: text("Title", "Judul"), description: textarea("Description", "Deskripsi"), href: plain("Link (optional)", "Link (opsional)") },
      defaultProps: { title: L("Card title", "Judul kartu"), description: L("Short supporting text.", "Teks pendukung singkat.") },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <CardView el={{ ...props, blockType: "card" } as never} />
        </ElementFrame>
      ),
    },
    spacer: {
      label: L("Spacer", "Jarak"),
      fields: { size: radio("Size", "Ukuran", [["sm", "S", "K"], ["md", "M", "S"], ["lg", "L", "B"], ["xl", "XL", "XL"]]) },
      defaultProps: { size: "md" },
      render: ({ puck: _p, ...props }) => (
        <ElementFrame>
          <SpacerView el={{ ...props, blockType: "spacer" } as never} />
        </ElementFrame>
      ),
    },
  };

  const sectionTypes = Object.keys(components).filter((k) => k !== "layoutSection" && !ELEMENT_TYPES.includes(k));

  // Same grouping as the Puck demo: building blocks first, ready-made sections last.
  return {
    categories: {
      layout: { title: s.catLayout, components: ["layoutSection", "spacer"] },
      typography: { title: s.catTypography, components: ["badge", "heading", "paragraph"] },
      actions: { title: s.catActions, components: ["button"] },
      media: { title: s.catMedia, components: ["image", "card"] },
      sections: { title: s.catSections, components: sectionTypes },
    },
    components,
    root: {
      fields: {
        title: plain("Page title", "Judul halaman"),
        settings: {
          type: "custom",
          label: L("Editor", "Editor"),
          render: () => (
            <PageSettingsField lang={lang} locale={locale} cmsUrl={cmsUrl} pageId={pageId} embedded={embedded} s={s} />
          ),
        },
      },
      render: ({ children, puck }: { children: React.ReactNode; puck: { metadata: unknown } }) => {
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
      },
    },
  };
}
