import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";

async function getProfessional(categorySlug: string, professionalSlug: string) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();
  if (!category) return null;

  const { data: professional } = await supabase
    .from("professionals")
    .select("*")
    .eq("category_id", category.id)
    .eq("slug", professionalSlug)
    .eq("is_active", true)
    .single();
  if (!professional) return null;

  return { category, professional };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const result = await getProfessional(category, slug);
  if (!result) return {};
  return {
    title: result.professional.name,
    description: result.professional.description ?? undefined,
    alternates: { canonical: `/baalei-miktzoa/${category}/${slug}` },
  };
}

export default async function ProfessionalProfilePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const result = await getProfessional(categorySlug, slug);
  if (!result) notFound();
  const { category, professional } = result;

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: professional.name,
          description: professional.description ?? undefined,
          telephone: professional.phone ?? undefined,
          url: professional.website ?? undefined,
          areaServed: professional.service_areas ?? undefined,
        }}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
        <Link
          href={`/baalei-miktzoa/${category.slug}`}
          className="text-sm font-medium text-navy-500 underline-offset-4 hover:underline"
        >
          ← חזרה ל{category.name}
        </Link>

        <div className="mt-6 overflow-hidden rounded-md border border-line bg-card">
          <div className="h-1 bg-gradient-to-l from-gold-500 to-navy-700" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-paper">
                {professional.logo_url ? (
                  <Image
                    src={professional.logo_url}
                    alt=""
                    fill
                    sizes="4rem"
                    className="object-contain"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="unit flex h-full w-full items-center justify-center text-xl font-semibold text-silver-500"
                  >
                    {professional.name.trim().charAt(0)}
                  </span>
                )}
              </div>
              <h1 className="display text-[1.75rem] leading-tight text-heading">
                {professional.name}
              </h1>
            </div>

            {professional.is_house_brand && professional.disclosure_text && (
              <p className="mt-5 border-r-2 border-gold-500 bg-gold-500/[0.09] px-4 py-3 text-sm font-medium text-foreground">
                {professional.disclosure_text}
              </p>
            )}

            {professional.description && (
              <p className="mt-6 leading-relaxed text-muted">
                {professional.description}
              </p>
            )}

            {professional.service_areas && (
              <p className="mt-5 text-sm">
                <span className="unit text-[0.6875rem] uppercase tracking-[0.14em] text-gold-700">
                  אזורי שירות
                </span>
                <br />
                <span className="text-foreground">
                  {professional.service_areas}
                </span>
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {professional.phone && (
                <a
                  href={`tel:${professional.phone}`}
                  className="unit rounded-full bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
                >
                  {professional.phone}
                </a>
              )}
              {professional.whatsapp && (
                <a
                  href={`https://wa.me/${professional.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-700 hover:text-white"
                >
                  שלחו הודעה בוואטסאפ
                </a>
              )}
              {professional.website && (
                <a
                  href={professional.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-silver-500"
                >
                  לאתר
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
