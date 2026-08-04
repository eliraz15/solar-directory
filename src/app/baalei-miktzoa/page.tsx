import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoverImage } from "@/components/cover-image";
import { getCategoryPhoto } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "מדריך בעלי מקצוע",
  description:
    "מדריך בעלי מקצוע מומלצים למערכות סולאריות: מתקינים, חשמלאים, תחזוקה, ייעוץ וניטור.",
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

      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <p className="eyebrow text-gold-700">תוכן ממומן</p>
          <h1 className="display mt-4 text-[clamp(2rem,4.4vw,3.25rem)] text-heading">
            בעלי מקצוע
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            כל קטגוריה מוגבלת לשלושה בעלי מקצוע, שמשלמים עבור ההצגה. זו אינה
            המלצה מקצועית —{" "}
            <Link
              href="/about"
              className="font-medium text-navy-500 underline underline-offset-4"
            >
              כך זה עובד
            </Link>
            .
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/baalei-miktzoa/${c.slug}`}
              className="group overflow-hidden rounded-md border border-line bg-card transition hover:border-silver-500"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-navy-900">
                <CoverImage
                  fallback={getCategoryPhoto(c.slug)}
                  alt={c.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="opacity-85 transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5">
                <h2 className="display text-[1.2rem] leading-snug text-foreground group-hover:text-navy-500">
                  {c.name}
                </h2>
                {c.description && (
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
