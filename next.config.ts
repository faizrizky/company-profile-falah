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
    // Asset audit: all resources are local (public/ + next/font self-hosted).
    // script-src 'unsafe-inline' is required: App Router prerenders the RSC
    // payload as inline <script>self.__next_f.push(...)</script> tags.
    // style-src 'unsafe-inline' is required: React inline style attributes.
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
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
