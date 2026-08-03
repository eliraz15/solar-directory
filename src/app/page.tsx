import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { CATEGORY_ICONS } from "@/lib/category-icons";

const HERO_FEATURES = [
  { icon: "☀️", label: "ייצור והספק" },
  { icon: "💰", label: "כלכלה וחיסכון" },
  { icon: "🧹", label: "תחזוקה" },
  { icon: "📡", label: "ניטור" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, excerpt")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "solar.org.il",
          url: "https://solar.org.il",
          inLanguage: "he",
        }}
      />
      <SiteHeader />

      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
            מדריך עצמאי למערכות סולאריות בישראל
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/85">
            כל מה שצריך לדעת על התקנה, רגולציה, תחזוקה וכלכלה של מערכת סולארית
            פוטו-וולטאית — ומדריך בעלי מקצוע מומלצים באזור שלכם.
          </p>
          <Link
            href="/madrichim"
            className="mt-8 inline-block rounded-full bg-sun px-8 py-3 font-bold text-brand-dark shadow-lg shadow-black/20 transition hover:bg-sun-dark"
          >
            למדריכים
          </Link>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {HERO_FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl backdrop-blur">
                  {f.icon}
                </div>
                <span className="text-sm text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
        {articles && articles.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-brand">מדריכים אחרונים</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/madrichim/${a.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-brand">
                    {a.title}
                  </h3>
                  {a.excerpt && <p className="mt-1 text-sm text-muted">{a.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-6 text-2xl font-bold text-brand">בעלי מקצוע מומלצים</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(categories ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/baalei-miktzoa/${c.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-2xl">
                  {CATEGORY_ICONS[c.slug] ?? "☀️"}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand">
                    {c.name}
                  </h3>
                  {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
