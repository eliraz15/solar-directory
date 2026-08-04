import Link from "next/link";
import { Wordmark } from "@/components/site-mark";

const COLUMNS = [
  {
    heading: "מדריכים",
    links: [
      { label: "ניקוי ותחזוקה", href: "/madrichim/tachzukat-nikuy-panelim" },
      {
        label: "ממיר, מיקרו־ממיר ואופטימייזר",
        href: "/madrichim/inverter-microinverter-optimizer-mah-hehevdel",
      },
      { label: "סוגי פאנלים", href: "/madrichim/sugei-panelim-solariim-mono-poly" },
      { label: "בחירת מתקין", href: "/madrichim/madrich-bchirat-matkin" },
    ],
  },
  {
    heading: "כלים",
    links: [
      { label: "מחשבון הפסד מלכלוך", href: "/#cleaning-calculator" },
      { label: "מחשבון החזר השקעה", href: "/#roi-calculator" },
      { label: "כל הנושאים", href: "/madrichim" },
    ],
  },
  {
    heading: "האתר",
    links: [
      { label: "שקיפות ואודות", href: "/about" },
      { label: "בעלי מקצוע", href: "/baalei-miktzoa" },
      { label: "SunWise", href: "https://sunwise.co.il" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/60">
              מדריך עצמאי למערכות סולאריות פוטו־וולטאיות בישראל.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h2 className="unit mb-4 text-[0.6875rem] uppercase tracking-[0.16em] text-gold-500">
                  {col.heading}
                </h2>
                <ul className="flex flex-col gap-2.5 text-[0.9375rem] text-white/70">
                  {col.links.map((link) => {
                    const external = link.href.startsWith("http");
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="underline-offset-4 transition-colors hover:text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/12 pt-7 text-sm text-white/55">
          <p className="max-w-3xl leading-relaxed">
            חלק מהרשומות באתר הן תוכן ממומן — בעלי מקצוע משלמים עבור הצגה במדריך,
            וקטגוריית הניטור כוללת שירות בבעלות מפעילי האתר. הפירוט המלא נמצא
            ב־
            <Link href="/about" className="text-gold-500 underline underline-offset-4">
              עמוד השקיפות
            </Link>
            .
          </p>
          <p className="unit mt-5 text-white/40">
            © {new Date().getFullYear()} solar.org.il
          </p>
        </div>
      </div>
    </footer>
  );
}
