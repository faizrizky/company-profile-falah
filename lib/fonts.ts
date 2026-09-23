import { Oxanium, Poppins } from "next/font/google";

export const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oxanium",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

/** Class names that expose the site fonts as CSS variables (also used inside the editor iframe). */
export const fontVariables = `${oxanium.variable} ${poppins.variable}`;
