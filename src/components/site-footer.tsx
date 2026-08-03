export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-muted">
        <p>
          חלק מהרשומות באתר זה הן תוכן ממומן — בעלי מקצוע משלמים עבור הצגה במדריך.
          לפרטים ראו את{" "}
          <a href="/about" className="underline">
            עמוד השקיפות שלנו
          </a>
          .
        </p>
        <p className="mt-2">© {new Date().getFullYear()} solar.org.il</p>
      </div>
    </footer>
  );
}
