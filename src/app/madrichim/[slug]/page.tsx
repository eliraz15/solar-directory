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

  let relatedArticle: { slug: string; title: string; excerpt: string | null } | null = null;
  if (article.related_article_id) {
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt")
      .eq("id", article.related_article_id)
      .eq("status", "published")
      .single();
    relatedArticle = data;
  }

  return { ...article, category, relatedArticle };
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

  const { category, relatedArticle } = article;
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
        <h1 className="mb-2 text-3xl font-extrabold text-brand">{article.title}</h1>
        <p className="mb-8 text-sm text-muted">עודכן לאחרונה: {updatedDate}</p>

        <div
          className="max-w-none leading-relaxed text-foreground
            [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand
            [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pr-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pr-6
            [&_li]:mb-1 [&_a]:text-brand [&_a]:underline
            [&_blockquote]:border-r-4 [&_blockquote]:border-sun [&_blockquote]:bg-sun/10 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic"
          // Sanitized again at render as defense in depth (already sanitized on save).
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {category && (
          <div className="my-8 rounded-2xl bg-brand p-6 text-white">
            <p className="mb-3 font-semibold">
              מחפשים בעל מקצוע מהימן ב{category.name}?
            </p>
            <Link
              href={`/baalei-miktzoa/${category.slug}`}
              className="inline-block rounded-full bg-sun px-5 py-2 font-bold text-brand-dark hover:bg-sun-dark"
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
            <h2 className="mb-4 text-xl font-bold text-brand">שאלות נפוצות</h2>
            <div className="flex flex-col gap-4">
              {article.faq_items.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <h3 className="font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-1 text-sm text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedArticle && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-brand">להמשך קריאה</h2>
            <Link
              href={`/madrichim/${relatedArticle.slug}`}
              className="group block rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold text-foreground group-hover:text-brand">
                {relatedArticle.title}
              </h3>
              {relatedArticle.excerpt && (
                <p className="mt-1 text-sm text-muted">{relatedArticle.excerpt}</p>
              )}
            </Link>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
