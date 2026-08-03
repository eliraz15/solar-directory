import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand">
          ☀️ solar.org.il
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/madrichim">מדריכים</Link>
          <Link href="/baalei-miktzoa">בעלי מקצוע</Link>
        </nav>
      </div>
    </header>
  );
}
