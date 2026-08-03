import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" dir="ltr" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-2xl leading-none">☀️</span>
          <span className="text-brand">solar</span>
          <span className="text-sun">.org.il</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/madrichim"
            className="rounded-full px-4 py-2 text-foreground hover:bg-border/50"
          >
            מדריכים
          </Link>
          <Link
            href="/baalei-miktzoa"
            className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            בעלי מקצוע
          </Link>
        </nav>
      </div>
    </header>
  );
}
