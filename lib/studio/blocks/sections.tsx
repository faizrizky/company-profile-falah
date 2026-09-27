"use client";

import type { ComponentConfig, Fields } from "@puckeditor/core";

import { blockComponents } from "@/components/blocks/RenderBlocks";
import type { BlockContext } from "@/components/blocks/types";
import type { Page } from "@/types/cms";

import type { StudioFields } from "./fields";
import { meta, type AnyProps } from "./metadata";

type Block = Page["layout"][number];

/** Ready-made sections (Hero, CTA, FAQ…), rendered with the live site's blocks. */
export function sectionComponents(f: StudioFields): Record<string, ComponentConfig<AnyProps>> {
  const {
    text,
    textarea,
    plain,
    link,
    number,
    select,
    toggle,
    image,
    video,
    tags,
    partnersField,
    certificationsField,
    header,
    buttons,
    list,
    headerDefaults,
    L,
    data,
  } = f;

  // Each section renders the live site's block component.
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

  return {
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
          ...(variant !== "home" ? { showCertificates } : {}),
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
        items: list(
          "Items",
          "Item",
          {
            icon: image("Icon", "Ikon"),
            title: text("Title", "Judul"),
            description: textarea("Description", "Deskripsi"),
          },
          "title",
          { title: L("Item", "Item") },
          6,
        ),
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
            button: {
              type: "object",
              label: L("Button", "Tombol"),
              objectFields: { label: text("Label", "Label"), href: link("Link", "Link") },
            },
          },
        },
        items: list(
          "Small cards",
          "Kartu kecil",
          { image: image("Image", "Gambar"), title: text("Title", "Judul"), href: link("Link", "Link") },
          "title",
          { title: L("Card", "Kartu"), href: "/solution" },
          7,
        ),
      },
      defaultProps: {
        header: headerDefaults,
        featured: { title: L("Featured", "Utama"), tags: [], button: {} },
        items: [],
      },
    }),
    expertise: section("expertise", {
      label: L("Expertise + stats", "Keahlian + statistik"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        stats: list(
          "Stats",
          "Statistik",
          { value: number("Value", "Angka"), suffix: plain("Suffix", "Akhiran"), label: text("Label", "Label") },
          "label",
          { value: 10, suffix: "+", label: L("Metric", "Metrik") },
          4,
        ),
        cards: list(
          "Cards",
          "Kartu",
          {
            image: image("Image", "Gambar"),
            icon: image("Icon", "Ikon"),
            title: text("Title", "Judul"),
            description: textarea("Description", "Deskripsi"),
          },
          "title",
          { title: L("Card", "Kartu") },
          6,
        ),
      },
      defaultProps: { header: headerDefaults, stats: [], cards: [] },
    }),
    featureGrid: section("featureGrid", {
      label: L("Feature grid", "Grid fitur"),
      fields: {
        variant: select("Variant", "Varian", [
          ["cards", "Cards — 3 columns", "Kartu — 3 kolom"],
          ["values", "Values — 4 columns + quote", "Nilai — 4 kolom + kutipan"],
        ]),
        header: header(),
        background: image("Background", "Latar belakang"),
        backgroundOverlay: image("Background overlay", "Lapisan latar"),
        quote: text("Quote", "Kutipan"),
        items: list(
          "Items",
          "Item",
          {
            icon: image("Icon", "Ikon"),
            title: text("Title", "Judul"),
            description: textarea("Description", "Deskripsi"),
          },
          "title",
          { title: L("Feature", "Fitur") },
          8,
        ),
      },
      defaultProps: { variant: "cards", header: headerDefaults, items: [] },
    }),
    leadership: section("leadership", {
      label: L("Leadership", "Kepemimpinan"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        leaders: list(
          "People",
          "Orang",
          {
            photo: image("Photo", "Foto"),
            name: text("Name", "Nama"),
            roles: tags("Roles", "Jabatan"),
            bio: textarea("Bio", "Bio"),
          },
          "name",
          { name: L("Name", "Nama"), roles: [] },
          8,
        ),
      },
      defaultProps: { header: headerDefaults, leaders: [] },
    }),
    teamStats: section("teamStats", {
      label: L("Team stats", "Statistik tim"),
      fields: {
        header: header(),
        background: image("Background", "Latar belakang"),
        items: list(
          "Stats",
          "Statistik",
          { label: text("Label", "Label"), value: number("Value", "Angka"), suffix: plain("Suffix", "Akhiran") },
          "label",
          { label: L("Team", "Tim"), value: 10, suffix: "+" },
          8,
        ),
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
        variant: select("Variant", "Varian", [
          ["cards", "Cards", "Kartu"],
          ["gallery", "Gallery (zoomable)", "Galeri (bisa diperbesar)"],
        ]),
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
        items: list(
          "Questions",
          "Pertanyaan",
          { question: text("Question", "Pertanyaan"), answer: textarea("Answer", "Jawaban") },
          "question",
          { question: L("Question?", "Pertanyaan?"), answer: L("Answer.", "Jawaban.") },
          20,
        ),
      },
      defaultProps: { header: headerDefaults, items: [] },
    }),
    workflow: section("workflow", {
      label: L("Workflow steps", "Langkah kerja"),
      fields: {
        header: header(),
        steps: list(
          "Steps",
          "Langkah",
          { title: text("Title", "Judul"), description: textarea("Description", "Deskripsi") },
          "title",
          { title: L("Step", "Langkah") },
          8,
        ),
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
        variant: select("Variant", "Varian", [
          ["simple", "Simple", "Sederhana"],
          ["withMedia", "With media / video", "Dengan media / video"],
        ]),
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
  };
}
