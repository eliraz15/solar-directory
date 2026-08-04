import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoverImage } from "@/components/cover-image";
import { TOPIC_LABELS, TOPIC_ORDER, TOPIC_BLURBS } from "@/lib/topics";
import { getArticlePhoto } from "@/lib/site-images";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { ArticleTopic } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "מדריכים",
  description:
    "מדריכים על מערכות סולאריות פוטו-וולטאיות: התקנה, רגולציה, תחזוקה וכלכלה.",
};

function isArticleTopic(value: string | undefined): value is ArticleTopic {
  return !!value && (TOPIC_ORDER as string[]).includes(value);
}

export default async function GuidesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic: rawTopic } = await searchParams;
  const activeTopic = isArticleTopic(rawTopic) ? rawTopic : null;

  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("slug, title, excerpt, updated_at, topic, cover_image_url, content")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (activeTopic) {
    query = query.eq("topic", activeTopic);
  }

  const { data: articles } = await query;
  const list = articles ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
          <p className="eyebrow text-gold-700">
            {activeTopic ? "נושא" : "ארכיון"}
          </p>
          <h1 className="display mt-4 text-[clamp(2rem,4.4vw,3.25rem)] text-heading">
            {activeTopic ? TOPIC_LABELS[activeTopic] : "מדריכים"}
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            {activeTopic
              ? TOPIC_BLURBS[activeTopic]
              : "כל מה שכתבנו על תפוקה, ניקיון, תקלות וכלכלה של מערכות סולאריות."}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <nav
          aria-label="סינון לפי נושא"
          className="mb-12 flex flex-wrap gap-2 border-b border-line pb-6"
        >
          <Link
            href="/madrichim"
            aria-current={!activeTopic ? "page" : undefined}
            className={
              !activeTopic
                ? "rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-silver-500 hover:text-foreground"
            }
          >
            הכל
          </Link>
          {TOPIC_ORDER.map((topic) => (
            <Link
              key={topic}
              href={`/madrichim?topic=${topic}`}
              aria-current={activeTopic === topic ? "page" : undefined}
              className={
                activeTopic === topic
                  ? "rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-silver-500 hover:text-foreground"
              }
            >
              {TOPIC_LABELS[topic]}
            </Link>
          ))}
        </nav>

        {list.length === 0 ? (
          <p className="py-12 text-muted">
            אין עדיין מדריכים בנושא הזה.{" "}
            <Link
              href="/madrichim"
              className="font-semibold text-navy-500 underline underline-offset-4"
            >
              חזרה לכל המדריכים
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col">
            {list.map((a) => (
              <li key={a.slug} className="border-b border-line last:border-0">
                <Link
                  href={`/madrichim/${a.slug}`}
                  className="group grid gap-5 py-7 sm:grid-cols-[13rem_1fr] sm:gap-7"
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-navy-900 sm:aspect-[4/3]">
                    <CoverImage
                      src={a.cover_image_url}
                      fallback={getArticlePhoto(a.topic, a.slug)}
                      alt={a.title}
                      sizes="(max-width: 640px) 100vw, 13rem"
                      className="transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      {a.topic && (
                        <span className="unit text-[0.6875rem] uppercase tracking-[0.14em] text-gold-700">
                          {TOPIC_LABELS[a.topic]}
                        </span>
                      )}
                      <span className="unit text-[0.6875rem] text-muted">
                        {estimateReadingMinutes(a.content)} דק׳ קריאה
                      </span>
                    </div>

                    <h2 className="display mt-2 text-[1.4rem] leading-tight text-foreground transition-colors group-hover:text-navy-500 sm:text-[1.6rem]">
                      {a.title}
                    </h2>

                    {a.excerpt && (
                      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                        {a.excerpt}
                      </p>
                    )}

                    <p className="unit mt-3 text-xs text-muted">
                      עודכן {new Date(a.updated_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
