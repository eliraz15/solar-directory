import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Display: the Hebrew editorial serif. The site is an independent guide, not a
// vendor, and the newspaper face is what says so.
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "800", "900"],
});

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800"],
});

// Utility face for units and readouts (kWh, ₪, %, kWp) — the instrument voice.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solar.org.il"),
  title: {
    default: "מדריך מערכות סולאריות | solar.org.il",
    template: "%s | solar.org.il",
  },
  description:
    "מדריך עצמאי למערכות סולאריות פוטו-וולטאיות בישראל: התקנה, רגולציה, תחזוקה וכלכלה — ומדריך בעלי מקצוע מומלצים.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frankRuhl.variable} ${heebo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
