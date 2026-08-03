import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { BannerDisplay } from "@/components/banner-display";
import { sanitizeArticleHtml } from "@/lib/sanitize";

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return null;

  let category: { id: string; slug: string; name: string } | null = null;
  if (article.related_category_id) {
    const { data } = await supabase
      .from("categories")
      .select("id, slug, name")
      .eq("id", article.related_category_id)
      .single();
    category = data;
  }

  return { ...article, category };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.meta_description ?? article.excerpt ?? undefined,
    alternates: { canonical: `/madrichim/${article.slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { category } = article;
  const updatedDate = new Date(article.updated_at).toLocaleDateString("he-IL");

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.meta_description ?? article.excerpt ?? undefined,
          dateModified: article.updated_at,
          datePublished: article.published_at ?? article.created_at,
          inLanguage: "he",
        }}
      />
      {article.faq_items.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faq_items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }}
        />
      )}
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="mb-2 text-3xl font-semibold">{article.title}</h1>
        <p className="mb-8 text-sm text-muted">עודכן לאחרונה: {updatedDate}</p>

        <div
          className="prose prose-neutral max-w-none"
          // Sanitized again at render as defense in depth (already sanitized on save).
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {category && (
          <div className="my-8 rounded-lg border border-brand/30 bg-brand/5 p-5">
            <p className="mb-3 font-medium">
              מחפשים בעל מקצוע מהימן ב{category.name}?
            </p>
            <Link
              href={`/baalei-miktzoa/${category.slug}`}
              className="inline-block rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark"
            >
              השוואת בעלי מקצוע מומלצים
            </Link>
          </div>
        )}

        {category && (
          <BannerDisplay
            placement="article_inline"
            categoryId={category.id}
            pagePath={`/madrichim/${article.slug}`}
            className="my-8"
          />
        )}

        {article.faq_items.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">שאלות נפוצות</h2>
            <div className="flex flex-col gap-4">
              {article.faq_items.map((item, i) => (
                <div key={i} className="rounded border border-border p-4">
                  <h3 className="font-medium">{item.question}</h3>
                  <p className="mt-1 text-sm text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
