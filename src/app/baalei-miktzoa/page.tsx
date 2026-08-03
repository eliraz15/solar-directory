import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
        <h1 className="mb-8 text-3xl font-semibold">מדריך בעלי מקצוע</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/baalei-miktzoa/${c.slug}`}
              className="rounded-lg border border-border p-4 hover:border-brand"
            >
              <h2 className="font-medium">{c.name}</h2>
              {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
