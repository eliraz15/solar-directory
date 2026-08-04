import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { BannerDisplay } from "@/components/banner-display";
import { CoverImage } from "@/components/cover-image";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { TOPIC_LABELS } from "@/lib/topics";
import { getArticlePhoto } from "@/lib/site-images";
import { estimateReadingMinutes } from "@/lib/reading-time";

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

  let relatedArticle: {
    slug: string;
    title: string;
    excerpt: string | null;
    topic: string | null;
    cover_image_url: string | null;
  } | null = null;
  if (article.related_article_id) {
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt, topic, cover_image_url")
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
  const topicLabel = article.topic ? TOPIC_LABELS[article.topic] : null;

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

      {/* Feature header ---------------------------------------------------- */}
      <header className="relative isolate overflow-hidden bg-navy-900">
        <div className="absolute inset-0 -z-10">
          <CoverImage
            src={article.cover_image_url}
            fallback={getArticlePhoto(article.topic, article.slug)}
            alt=""
            sizes="100vw"
            priority
          />
        </div>
        <div className="scrim-hero absolute inset-0 -z-10" />

        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
          {topicLabel && (
            <Link
              href={`/madrichim?topic=${article.topic}`}
              className="eyebrow text-gold-500 hover:text-white"
            >
              {topicLabel}
            </Link>
          )}
          <h1 className="display mt-5 text-[clamp(1.9rem,4.6vw,3rem)] text-white">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/75">
              {article.excerpt}
            </p>
          )}
          <p className="unit mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
            <span>עודכן {updatedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{estimateReadingMinutes(article.content)} דק׳ קריאה</span>
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <div
          className="article-body"
          // Sanitized again at render as defense in depth (already sanitized on save).
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {category && (
          <aside className="my-12 overflow-hidden rounded-md border border-line bg-paper">
            <div className="h-1 bg-gradient-to-l from-gold-500 to-navy-700" />
            <div className="p-6">
              <p className="eyebrow text-gold-700">השלב הבא</p>
              <p className="display mt-3 text-[1.3rem] leading-snug text-heading">
                מחפשים בעל מקצוע ב{category.name}?
              </p>
              <Link
                href={`/baalei-miktzoa/${category.slug}`}
                className="mt-5 inline-block rounded-full bg-navy-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900"
              >
                השוואת בעלי מקצוע
              </Link>
            </div>
          </aside>
        )}

        {category && (
          <BannerDisplay
            placement="article_inline"
            categoryId={category.id}
            pagePath={`/madrichim/${article.slug}`}
            className="my-10"
          />
        )}

        {article.faq_items.length > 0 && (
          <section className="mt-14">
            <p className="eyebrow text-gold-700">שאלות נפוצות</p>
            <h2 className="display mb-6 mt-4 text-[1.6rem] text-heading">
              מה עוד שואלים
            </h2>
            <dl className="border-t border-line">
              {article.faq_items.map((item, i) => (
                <div key={i} className="border-b border-line py-5">
                  <dt className="font-semibold text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-muted">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {relatedArticle && (
          <section className="mt-14">
            <p className="eyebrow text-gold-700">להמשך קריאה</p>
            <Link
              href={`/madrichim/${relatedArticle.slug}`}
              className="group mt-5 grid gap-5 sm:grid-cols-[10rem_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-navy-900">
                <CoverImage
                  src={relatedArticle.cover_image_url}
                  fallback={getArticlePhoto(
                    relatedArticle.topic,
                    relatedArticle.slug,
                  )}
                  alt={relatedArticle.title}
                  sizes="10rem"
                  className="transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div>
                <h3 className="display text-[1.3rem] leading-tight text-foreground transition-colors group-hover:text-navy-500">
                  {relatedArticle.title}
                </h3>
                {relatedArticle.excerpt && (
                  <p className="mt-2 leading-relaxed text-muted">
                    {relatedArticle.excerpt}
                  </p>
                )}
              </div>
            </Link>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
