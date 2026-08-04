import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BannerDisplay } from "@/components/banner-display";
import { JsonLd } from "@/components/json-ld";
import { CoverImage } from "@/components/cover-image";
import { getCategoryPhoto } from "@/lib/site-images";

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

      <header className="relative isolate overflow-hidden bg-navy-900">
        <div className="absolute inset-0 -z-10">
          <CoverImage
            fallback={getCategoryPhoto(category.slug)}
            alt=""
            sizes="100vw"
            priority
          />
        </div>
        <div className="scrim-hero absolute inset-0 -z-10" />

        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
          <Link
            href="/baalei-miktzoa"
            className="eyebrow text-gold-500 hover:text-white"
          >
            בעלי מקצוע
          </Link>
          <h1 className="display mt-5 text-[clamp(1.9rem,4.4vw,3rem)] text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-xl leading-relaxed text-white/75">
              {category.description}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <BannerDisplay
          placement="category_top"
          categoryId={category.id}
          pagePath={`/baalei-miktzoa/${category.slug}`}
          className="mb-10"
        />

        <ul className="flex flex-col gap-4">
          {professionals.map((p) => (
            <li key={p.id}>
              <Link
                href={`/baalei-miktzoa/${category.slug}/${p.slug}`}
                className={`group flex items-start gap-4 rounded-md border p-5 transition ${
                  p.is_house_brand
                    ? "border-gold-500 bg-gold-500/[0.07]"
                    : "border-line bg-card hover:border-silver-500"
                }`}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line bg-paper">
                  {p.logo_url ? (
                    <Image
                      src={p.logo_url}
                      alt=""
                      fill
                      sizes="3rem"
                      className="object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="unit flex h-full w-full items-center justify-center text-sm font-semibold text-silver-500"
                    >
                      {p.name.trim().charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground group-hover:text-navy-500">
                      {p.name}
                    </span>
                    {p.is_house_brand && (
                      <span className="unit rounded-full bg-gold-500 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-navy-900">
                        השירות שלנו
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                      {p.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {professionals.length === 0 && (
          <p className="rounded-md border border-dashed border-line px-5 py-10 text-center text-muted">
            בקרוב יתפרסמו כאן בעלי מקצוע בקטגוריה הזו.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
