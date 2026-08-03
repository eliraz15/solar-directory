import { notFound } from "next/navigation";
import Link from "next/link";
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
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <Link
          href={`/baalei-miktzoa/${category.slug}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          ← חזרה ל{category.name}
        </Link>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {professional.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={professional.logo_url}
                alt=""
                className="h-16 w-16 rounded-full object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/10 text-3xl">
                ⚡
              </div>
            )}
            <h1 className="text-2xl font-extrabold text-brand">{professional.name}</h1>
          </div>

          {professional.is_house_brand && professional.disclosure_text && (
            <div className="mt-4 rounded-lg bg-sun/15 px-3 py-2 text-sm font-medium text-sun-dark">
              {professional.disclosure_text}
            </div>
          )}

          {professional.description && (
            <p className="mt-6 text-muted">{professional.description}</p>
          )}

          {professional.service_areas && (
            <p className="mt-4 text-sm">
              <span className="font-semibold text-foreground">אזורי שירות: </span>
              <span className="text-muted">{professional.service_areas}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {professional.phone && (
              <a
                href={`tel:${professional.phone}`}
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                📞 {professional.phone}
              </a>
            )}
            {professional.whatsapp && (
              <a
                href={`https://wa.me/${professional.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-sun px-5 py-2 text-sm font-semibold text-brand-dark hover:bg-sun-dark"
              >
                💬 WhatsApp
              </a>
            )}
            {professional.website && (
              <a
                href={professional.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-border/40"
              >
                🌐 אתר אינטרנט
              </a>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
