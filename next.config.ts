import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

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
    // CSP decision (App Router + Turbopack, fully static prerendered site):
    // - script-src 'unsafe-inline' is REQUIRED: App Router prerenders the RSC
    //   payload as inline <script>self.__next_f.push(...)</script> tags (28 per
    //   page). Nonces are infeasible: static HTML is built once with no
    //   per-request nonce injection; hashes are infeasible: the flight payload
    //   differs per page and headers() is static (baked at build time), so any
    //   content change would silently break every page.
    // - style-src 'unsafe-inline' is REQUIRED: React inline style attributes
    //   (style="...") can only be allowed via 'unsafe-inline' (no hash/nonce
    //   support for attributes). No inline <style> tags are emitted.
    // - img-src/font-src are 'self' only: asset audit found zero data: URIs
    //   (fonts are self-hosted /_next/static/media/*.woff2 via next/font).
    // - upgrade-insecure-requests: zero external origins, all resources are
    //   same-origin relative paths; inert over HTTP, safe over HTTPS.
    // - No report-uri: the site has no API endpoint to receive reports.
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ].join("; "),
    },
  );
}

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
