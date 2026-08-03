import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "מדריכים",
  description: "מדריכים על מערכות סולאריות פוטו-וולטאיות: התקנה, רגולציה, תחזוקה וכלכלה.",
};

export default async function GuidesIndexPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, excerpt, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="mb-8 text-3xl font-extrabold text-brand">מדריכים</h1>
        <div className="flex flex-col gap-4">
          {(articles ?? []).map((a) => (
            <Link
              key={a.slug}
              href={`/madrichim/${a.slug}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-foreground group-hover:text-brand">
                {a.title}
              </h2>
              {a.excerpt && <p className="mt-1 text-sm text-muted">{a.excerpt}</p>}
              <p className="mt-2 text-xs text-muted">
                עודכן ב-{new Date(a.updated_at).toLocaleDateString("he-IL")}
              </p>
            </Link>
          ))}
          {(articles ?? []).length === 0 && (
            <p className="text-muted">בקרוב יתפרסמו כאן מדריכים.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
