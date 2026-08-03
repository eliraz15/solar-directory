import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORY_ICONS } from "@/lib/category-icons";

export const metadata: Metadata = {
  title: "מדריך בעלי מקצוע",
  description: "מדריך בעלי מקצוע מומלצים למערכות סולאריות: מתקינים, חשמלאים, תחזוקה, ייעוץ וניטור.",
};

export default async function ProfessionalsIndexPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="mb-8 text-3xl font-extrabold text-brand">מדריך בעלי מקצוע</h1>
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
                <h2 className="font-semibold text-foreground group-hover:text-brand">{c.name}</h2>
                {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
