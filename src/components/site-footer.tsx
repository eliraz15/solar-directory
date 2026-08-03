export function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-white/80">
        <div dir="ltr" className="mb-4 flex items-center gap-2 text-lg font-extrabold text-white">
          <span className="text-xl leading-none">☀️</span>
          <span>solar</span>
          <span className="text-sun">.org.il</span>
        </div>
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
    </footer>
  );
}
