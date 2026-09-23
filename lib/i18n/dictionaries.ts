import type { Locale } from "@/lib/i18n/config";

/**
 * UI strings that live in code (form labels, aria labels, fallbacks).
 * Page copy itself comes from the CMS.
 */
const en = {
  nav: { toggleMenu: "Toggle menu", closeMenu: "Close menu", home: "Home", language: "Language" },
  footer: { contact: "Contact" },
  certificates: { show: "Show Certificate", view: "View {title}", close: "Close certificate modal" },
  video: { play: "Play video" },
  solutions: {
    comingSoon: "Solutions for this category are coming soon.",
    recommendedFor: "Recommended For",
    downloadBrochure: "Download Brochure",
    requestConsultation: "Request Consultation",
  },
  map: { title: "Office location map" },
  contact: {
    fullName: "Full name",
    fullNamePlaceholder: "Enter your name",
    organization: "Organization/Institution",
    organizationPlaceholder: "Enter your organization / institution name ...",
    email: "Email",
    emailPlaceholder: "Enter your email",
    phone: "Phone number",
    phonePlaceholder: "Enter your phone number",
    interest: "Consultation Interest",
    message: "Consultation Detail",
    messagePlaceholder: "Tell us about your needs, project goals, or challenges ...",
    sending: "Sending…",
    or: "Or",
    whatsapp: "Chat via Whatsapp",
    successFallback: "Thank you! Our team will contact you shortly.",
    errors: {
      fullName: "Please enter your name.",
      organization: "Please enter your organization.",
      email: "Please enter a valid email.",
      phone: "Please enter a valid phone number.",
      message: "Maximum 2000 characters.",
      invalid: "Please check the highlighted fields.",
      tooMany: "Too many requests. Please try again in a few minutes.",
      network: "Network error. Please check your connection and try again.",
      generic: "Something went wrong. Please try again.",
    },
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for doesn't exist or has been moved.",
    back: "Back to Home",
  },
};

export type Dictionary = typeof en;

const id: Dictionary = {
  nav: { toggleMenu: "Buka/tutup menu", closeMenu: "Tutup menu", home: "Beranda", language: "Bahasa" },
  footer: { contact: "Kontak" },
  certificates: { show: "Lihat Sertifikat", view: "Lihat {title}", close: "Tutup sertifikat" },
  video: { play: "Putar video" },
  solutions: {
    comingSoon: "Solusi untuk kategori ini segera hadir.",
    recommendedFor: "Direkomendasikan Untuk",
    downloadBrochure: "Unduh Brosur",
    requestConsultation: "Ajukan Konsultasi",
  },
  map: { title: "Peta lokasi kantor" },
  contact: {
    fullName: "Nama lengkap",
    fullNamePlaceholder: "Masukkan nama Anda",
    organization: "Organisasi/Institusi",
    organizationPlaceholder: "Masukkan nama organisasi / institusi ...",
    email: "Email",
    emailPlaceholder: "Masukkan email Anda",
    phone: "Nomor telepon",
    phonePlaceholder: "Masukkan nomor telepon Anda",
    interest: "Minat Konsultasi",
    message: "Detail Konsultasi",
    messagePlaceholder: "Ceritakan kebutuhan, tujuan proyek, atau tantangan Anda ...",
    sending: "Mengirim…",
    or: "Atau",
    whatsapp: "Chat via WhatsApp",
    successFallback: "Terima kasih! Tim kami akan segera menghubungi Anda.",
    errors: {
      fullName: "Mohon isi nama Anda.",
      organization: "Mohon isi nama organisasi.",
      email: "Mohon isi email yang valid.",
      phone: "Mohon isi nomor telepon yang valid.",
      message: "Maksimal 2000 karakter.",
      invalid: "Mohon periksa kolom yang ditandai.",
      tooMany: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi.",
      network: "Koneksi bermasalah. Periksa koneksi Anda lalu coba lagi.",
      generic: "Terjadi kesalahan. Silakan coba lagi.",
    },
  },
  notFound: {
    title: "Halaman tidak ditemukan",
    body: "Halaman yang Anda cari tidak ada atau telah dipindahkan.",
    back: "Kembali ke Beranda",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, id };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** "View {title}" + { title: "ISO" } → "View ISO" */
export const format = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
