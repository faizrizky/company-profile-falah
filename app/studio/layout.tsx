import type { Metadata } from "next";

import { fontVariables } from "@/lib/fonts";
import "../globals.css";
import "./studio.css";

export const metadata: Metadata = {
  title: "Falah Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${fontVariables} studio-body`}>{children}</body>
    </html>
  );
}
