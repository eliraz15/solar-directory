import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BannerDisplay } from "@/components/banner-display";
import { JsonLd } from "@/components/json-ld";

async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!category) return null;

  const { data: professionals } = await supabase
    .from("professionals")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("slot_position", { ascending: true, nullsFirst: false });

  return { category, professionals: professionals ?? [] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const result = await getCategory(slug);
  if (!result) return {};
  return {
    title: result.category.name,
    description:
      result.category.description ?? `בעלי מקצוע מומלצים בתחום ${result.category.name}`,
    alternates: { canonical: `/baalei-miktzoa/${result.category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const result = await getCategory(slug);
  if (!result) notFound();
  const { category, professionals } = result;

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: category.name,
          itemListElement: professionals.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "LocalBusiness",
              name: p.name,
              description: p.description ?? undefined,
              telephone: p.phone ?? undefined,
              url: p.website ?? undefined,
            },
          })),
        }}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold">{category.name}</h1>
        {category.description && (
          <p className="mb-6 text-muted">{category.description}</p>
        )}

        <BannerDisplay
          placement="category_top"
          categoryId={category.id}
          pagePath={`/baalei-miktzoa/${category.slug}`}
          className="mb-8"
        />

        <div className="flex flex-col gap-4">
          {professionals.map((p) => (
            <Link
              key={p.id}
              href={`/baalei-miktzoa/${category.slug}/${p.slug}`}
              className={
                p.is_house_brand
                  ? "flex items-center gap-4 rounded-lg border-2 border-sun/60 bg-sun/5 p-4"
                  : "flex items-center gap-4 rounded-lg border border-border p-4 hover:border-brand"
              }
            >
              {p.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logo_url} alt="" className="h-12 w-12 rounded object-contain" />
              )}
              <div>
                <div className="flex items-center gap-2 font-medium">
                  {p.name}
                  {p.is_house_brand && (
                    <span className="rounded-full bg-sun/20 px-2 py-0.5 text-xs text-sun">
                      השירות שלנו
                    </span>
                  )}
                </div>
                {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
              </div>
            </Link>
          ))}
          {professionals.length === 0 && (
            <p className="text-muted">בקרוב יתפרסמו כאן בעלי מקצוע מומלצים.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
