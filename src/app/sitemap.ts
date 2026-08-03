import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://solar.org.il";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: articles }, { data: categories }, { data: professionals }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("slug, updated_at")
        .eq("status", "published"),
      supabase.from("categories").select("id, slug"),
      supabase
        .from("professionals")
        .select("slug, category_id, updated_at")
        .eq("is_active", true),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/madrichim`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/baalei-miktzoa`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE_URL}/madrichim/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE_URL}/baalei-miktzoa/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categorySlugById = new Map((categories ?? []).map((c) => [c.id, c.slug]));

  const professionalRoutes: MetadataRoute.Sitemap = (professionals ?? [])
    .map((p) => {
      const categorySlug = categorySlugById.get(p.category_id);
      if (!categorySlug) return null;
      return {
        url: `${BASE_URL}/baalei-miktzoa/${categorySlug}/${p.slug}`,
        lastModified: p.updated_at,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      };
    })
    .filter((route): route is NonNullable<typeof route> => route !== null);

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...professionalRoutes];
}
