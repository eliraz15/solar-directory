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
        <Link href={`/baalei-miktzoa/${category.slug}`} className="text-sm text-brand underline">
          חזרה ל{category.name}
        </Link>

        <div className="mt-4 flex items-center gap-4">
          {professional.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={professional.logo_url}
              alt=""
              className="h-16 w-16 rounded object-contain"
            />
          )}
          <h1 className="text-2xl font-semibold">{professional.name}</h1>
        </div>

        {professional.is_house_brand && professional.disclosure_text && (
          <div className="mt-4 rounded bg-sun/10 px-3 py-2 text-sm text-sun">
            {professional.disclosure_text}
          </div>
        )}

        {professional.description && (
          <p className="mt-6 text-muted">{professional.description}</p>
        )}

        <div className="mt-6 flex flex-col gap-2 text-sm">
          {professional.service_areas && (
            <div>
              <span className="font-medium">אזורי שירות: </span>
              {professional.service_areas}
            </div>
          )}
          {professional.phone && (
            <div>
              <span className="font-medium">טלפון: </span>
              <a href={`tel:${professional.phone}`} className="text-brand underline">
                {professional.phone}
              </a>
            </div>
          )}
          {professional.whatsapp && (
            <div>
              <span className="font-medium">WhatsApp: </span>
              <a
                href={`https://wa.me/${professional.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                {professional.whatsapp}
              </a>
            </div>
          )}
          {professional.website && (
            <div>
              <span className="font-medium">אתר: </span>
              <a
                href={professional.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                {professional.website}
              </a>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
