import Link from "next/link";
import { Wordmark } from "@/components/site-mark";

const NAV = [
  { label: "מדריכים", href: "/madrichim" },
  { label: "מחשבונים", href: "/#cleaning-calculator" },
  { label: "שקיפות", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/92 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <Link href="/" aria-label="solar.org.il — לעמוד הבית">
            <Wordmark />
          </Link>

          <nav aria-label="ראשי" className="flex items-center gap-1 sm:gap-2">
            {/* Wide screens: inline. Narrow screens: the row below, so the
                links stay reachable without a menu to open. */}
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hidden rounded-full px-3 py-2 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-paper hover:text-navy-500 sm:block"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/baalei-miktzoa"
              className="rounded-full bg-navy-700 px-4 py-2 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-navy-900"
            >
              בעלי מקצוע
            </Link>
          </nav>
        </div>

        <nav
          aria-label="ראשי — ניווט משני"
          className="-mx-5 flex gap-1 overflow-x-auto border-t border-line px-5 py-2 sm:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-paper hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
