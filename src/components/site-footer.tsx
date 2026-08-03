import Link from "next/link";

const GUIDE_LINKS = [
  { label: "ניקוי", href: "/madrichim/tachzukat-nikuy-panelim" },
  { label: "ממירים", href: "/madrichim/inverter-microinverter-optimizer-mah-hehevdel" },
  { label: "פאנלים", href: "/madrichim/sugei-panelim-solariim-mono-poly" },
  { label: "בחירת מתקין", href: "/madrichim/madrich-bchirat-matkin" },
];

const TOOL_LINKS = [
  { label: "מחשבון ניקוי", href: "/#cleaning-calculator" },
  { label: "מחשבון ROI", href: "/#roi-calculator" },
];

const SUNWISE_LINKS = [
  { label: "ניטור מערכת", href: "https://sunwise.co.il" },
  { label: "הרשמה", href: "https://sunwise.co.il" },
  { label: "צור קשר", href: "mailto:support@sunwise.co.il" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand text-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div dir="ltr" className="mb-8 flex items-center gap-2 text-lg font-extrabold text-white">
          <span className="text-xl leading-none">☀️</span>
          <span>solar</span>
          <span className="text-sun">.org.il</span>
        </div>

        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-heading font-bold text-sun">מדריכים</h3>
            <ul className="flex flex-col gap-2 text-white/80">
              {GUIDE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading font-bold text-sun">כלים</h3>
            <ul className="flex flex-col gap-2 text-white/80">
              {TOOL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading font-bold text-sun">SunWise</h3>
            <ul className="flex flex-col gap-2 text-white/80">
              {SUNWISE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-sm text-white/80">
          <p>
            חלק מהרשומות באתר זה הן תוכן ממומן — בעלי מקצוע משלמים עבור הצגה במדריך.
            לפרטים ראו את{" "}
            <a href="/about" className="text-sun underline underline-offset-2">
              עמוד השקיפות שלנו
            </a>
            .
          </p>
          <p className="mt-4 text-white/60">© {new Date().getFullYear()} solar.org.il</p>
        </div>
      </div>
    </footer>
  );
}
