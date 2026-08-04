import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoverImage } from "@/components/cover-image";
import { PHOTOS } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "שקיפות ואודות",
  description:
    "כיצד אתר solar.org.il פועל, ואיך אנחנו בוחרים בעלי מקצוע מומלצים.",
};

const SECTIONS = [
  {
    heading: "איך בעלי המקצוע נבחרים?",
    body: "כל קטגוריה מוגבלת לעד שלושה בעלי מקצוע, שמשלמים עבור ההצגה במדריך. הופעה בקטגוריה אינה המלצה מקצועית ואינה בדיקת איכות — מומלץ להשוות כמה הצעות לפני שמחליטים.",
  },
  {
    heading: "קטגוריית ניטור מערכות",
    body: "קטגוריית הניטור כוללת אך ורק את SunWise, שהיא חברה בבעלות מפעילי האתר. הדבר מסומן בכל מקום שבו השירות מוצג.",
  },
  {
    heading: "המספרים במחשבונים",
    body: "המחשבונים באתר מבוססים על ייצור ותעריף חשמל ממוצעים בישראל, ומיועדים להערכה גסה בלבד. הם אינם ייעוץ פיננסי, והתוצאה בפועל תלויה בגג, בזווית, בהצללה ובתעריף שלכם.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <header className="relative isolate overflow-hidden bg-navy-900">
        <div className="absolute inset-0 -z-10">
          <CoverImage
            fallback={PHOTOS.installersRoof}
            alt=""
            sizes="100vw"
            priority
          />
        </div>
        <div className="scrim-hero absolute inset-0 -z-10" />

        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          <p className="eyebrow text-gold-500">גילוי נאות</p>
          <h1 className="display mt-5 text-[clamp(1.9rem,4.4vw,3rem)] text-white">
            איך האתר הזה מרוויח
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-white/75">
            solar.org.il הוא מדריך עצמאי למערכות סולאריות פוטו־וולטאיות בישראל.
            אנחנו כותבים תוכן, ולצדו מפעילים מדריך בעלי מקצוע ממומן. זה ההסבר
            המלא.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14">
        <div className="border-t border-line">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="border-b border-line py-8">
              <h2 className="display text-[1.4rem] leading-snug text-heading">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-[0.9375rem] text-muted">
          שאלה שלא נענתה כאן?{" "}
          <a
            href="mailto:support@sunwise.co.il"
            className="font-semibold text-navy-500 underline underline-offset-4"
          >
            כתבו לנו
          </a>
          , או{" "}
          <Link
            href="/madrichim"
            className="font-semibold text-navy-500 underline underline-offset-4"
          >
            חזרו למדריכים
          </Link>
          .
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
