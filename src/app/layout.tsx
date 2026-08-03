import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
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
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
