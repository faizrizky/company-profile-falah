import path from "node:path";

import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Where CMS media is served from: the CMS itself (local disk) or the public
 * bucket / CDN URL when S3/R2 storage is enabled.
 */
function mediaOrigins(): URL[] {
  return [process.env.CMS_MEDIA_URL, process.env.CMS_PUBLIC_URL, process.env.CMS_URL]
    .filter((value): value is string => Boolean(value))
    .map((value) => new URL(value));
}

const remotePatterns: RemotePattern[] = mediaOrigins().map((url) => ({
  protocol: url.protocol.replace(":", "") as "http" | "https",
  hostname: url.hostname,
  port: url.port,
}));
const mediaSources = [...new Set(mediaOrigins().map((url) => url.origin))];
const imgSrc = `img-src 'self'${mediaSources.map((origin) => ` ${origin}`).join("")}`;
// Videos (showcase, tab backgrounds) stream straight from the media origin.
const mediaSrc = `media-src 'self'${mediaSources.map((origin) => ` ${origin}`).join("")}`;
const cmsPublicOrigin = (() => {
  const url = process.env.CMS_PUBLIC_URL ?? process.env.CMS_URL;
  return url ? new URL(url).origin : "";
})();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
];

if (isProduction) {
  securityHeaders.push(
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    // CSP decision (App Router, CMS-driven ISR pages):
    // - script-src 'unsafe-inline' is REQUIRED: App Router emits the RSC
    //   payload as inline <script>self.__next_f.push(...)</script> tags. Nonces
    //   would force every page to render dynamically (no ISR cache); hashes are
    //   infeasible because the payload changes whenever content changes.
    // - style-src 'unsafe-inline' is REQUIRED: React inline style attributes.
    // - img-src / media-src: own origin (next/image) + the CMS media origin
    //   (plain <img> for SVG icons/logos, <video>). Nothing else.
    // - frame-src: only the Google Maps embed on the contact page.
    // - connect-src 'self': the contact form posts to our own /api/contact;
    //   the browser never talks to the CMS directly.
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        imgSrc,
        mediaSrc,
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://www.google.com",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join("; "),
    },
  );
}

/**
 * The visual editor (/studio) additionally talks to the CMS API from the
 * browser (save, media library, uploads) and renders its canvas in a
 * same-origin iframe. Public pages never get these permissions.
 */
const studioFrameAncestors = `frame-ancestors 'self' ${cmsPublicOrigin}`.trim();
const studioHeaders = [
  // Embedded in the CMS admin: framing is allowed for the CMS origin only (CSP
  // frame-ancestors), so the blanket X-Frame-Options: DENY is dropped here.
  ...securityHeaders.filter((h) => h.key !== "Content-Security-Policy" && h.key !== "X-Frame-Options"),
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
  ...(isProduction
    ? [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            `${imgSrc} blob: data:`,
            `${mediaSrc} blob:`,
            "font-src 'self' data:",
            `connect-src 'self' ${cmsPublicOrigin}`.trim(),
            "frame-src 'self' https://www.google.com",
            "object-src 'none'",
            studioFrameAncestors,
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
      ]
    : [{ key: "Content-Security-Policy", value: studioFrameAncestors }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns },
  // Pin the workspace root (a stray lockfile higher up confuses auto-detection).
  turbopack: { root: path.resolve(".") },
  async headers() {
    return [
      { source: "/((?!studio).*)", headers: securityHeaders },
      { source: "/studio/:path*", headers: studioHeaders },
    ];
  },
};

export default nextConfig;
