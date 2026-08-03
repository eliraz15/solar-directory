import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CoverImage } from "@/components/cover-image";
import { TOPIC_ICONS, TOPIC_LABELS, TOPIC_ORDER } from "@/lib/topics";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { ArticleTopic } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "מדריכים",
  description: "מדריכים על מערכות סולאריות פוטו-וולטאיות: התקנה, רגולציה, תחזוקה וכלכלה.",
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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
        <h1 className="mb-6 text-3xl font-extrabold text-brand">מדריכים</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/madrichim"
            className={
              !activeTopic
                ? "rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-border/40"
            }
          >
            הכל
          </Link>
          {TOPIC_ORDER.map((topic) => (
            <Link
              key={topic}
              href={`/madrichim?topic=${topic}`}
              className={
                activeTopic === topic
                  ? "rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-border/40"
              }
            >
              {TOPIC_ICONS[topic]} {TOPIC_LABELS[topic]}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(articles ?? []).map((a) => (
            <Link
              key={a.slug}
              href={`/madrichim/${a.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <CoverImage
                src={a.cover_image_url}
                icon={a.topic ? TOPIC_ICONS[a.topic] : "☀️"}
                alt={a.title}
                className="h-40 w-full"
              />
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-xs">
                  {a.topic && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 font-semibold text-brand">
                      {TOPIC_LABELS[a.topic]}
                    </span>
                  )}
                  <span className="text-muted">
                    {estimateReadingMinutes(a.content)} דק&apos; קריאה
                  </span>
                </div>
                <h2 className="font-heading font-bold text-foreground group-hover:text-brand">
                  {a.title}
                </h2>
                {a.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{a.excerpt}</p>}
                <p className="mt-2 text-xs text-muted">
                  עודכן ב-{new Date(a.updated_at).toLocaleDateString("he-IL")}
                </p>
              </div>
            </Link>
          ))}
          {(articles ?? []).length === 0 && (
            <p className="text-muted">אין עדיין מדריכים בנושא הזה.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
