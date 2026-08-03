import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";

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
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">
            מדריך עצמאי למערכות סולאריות בישראל
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            כל מה שצריך לדעת על התקנה, רגולציה, תחזוקה וכלכלה של מערכת סולארית
            פוטו-וולטאית — ומדריך בעלי מקצוע מומלצים באזור שלכם.
          </p>
          <Link
            href="/madrichim"
            className="mt-6 inline-block rounded bg-brand px-6 py-3 text-white hover:bg-brand-dark"
          >
            למדריכים
          </Link>
        </section>

        {articles && articles.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-4 text-xl font-semibold">מדריכים אחרונים</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/madrichim/${a.slug}`}
                  className="rounded-lg border border-border p-4 hover:border-brand"
                >
                  <h3 className="font-medium">{a.title}</h3>
                  {a.excerpt && <p className="mt-1 text-sm text-muted">{a.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold">בעלי מקצוע מומלצים</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(categories ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/baalei-miktzoa/${c.slug}`}
                className="rounded-lg border border-border p-4 hover:border-brand"
              >
                <h3 className="font-medium">{c.name}</h3>
                {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
