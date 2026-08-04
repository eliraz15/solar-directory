import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { CoverImage } from "@/components/cover-image";
import { TopicModule } from "@/components/topic-module";
import { CleaningLossCalculator } from "@/components/cleaning-loss-calculator";
import { RoiCalculator } from "@/components/roi-calculator";
import { TOPIC_LABELS, TOPIC_ORDER } from "@/lib/topics";
import { PHOTOS, getArticlePhoto, getCategoryPhoto } from "@/lib/site-images";
import { estimateReadingMinutes } from "@/lib/reading-time";
import type { ArticleTopic } from "@/lib/supabase/types";

const SUNWISE_URL = "https://sunwise.co.il";

const SUNWISE_POINTS = [
  "התראה בוואטסאפ כשהתפוקה יורדת",
  "זיהוי תקלות אוטומטי לפי דפוסי ייצור",
  "המלצה מתי כדאי לנקות",
  "סיכום יומי של מה שהמערכת ייצרה",
];

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: articles }, { data: settings }] =
    await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase
        .from("articles")
        .select("slug, title, excerpt, content, topic, cover_image_url, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase.from("site_settings").select("*").eq("id", true).single(),
    ]);

  const published = articles ?? [];
  const latest = published.slice(0, 3);

  // Counts shown on the page are read off the real content, never invented.
  const counts = TOPIC_ORDER.reduce(
    (acc, topic) => {
      acc[topic] = published.filter((a) => a.topic === topic).length;
      return acc;
    },
    {} as Record<ArticleTopic, number>,
  );

  const stats = [
    { value: published.length, label: "מדריכים" },
    { value: TOPIC_ORDER.length, label: "נושאים" },
    { value: 2, label: "מחשבונים" },
    { value: (categories ?? []).length, label: "קטגוריות בעלי מקצוע" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "solar.org.il",
          url: "https://solar.org.il",
          inLanguage: "he",
        }}
      />
      <SiteHeader />

      {/* Hero ------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={settings?.hero_image_url ?? PHOTOS.roofSunrise}
          alt="שמש נמוכה מעל שורות פאנלים סולאריים על גג שטוח"
          fill
          priority
          sizes="100vw"
          placeholder={settings?.hero_image_url ? undefined : "blur"}
          className="-z-10 object-cover"
        />
        <div className="scrim-hero absolute inset-0 -z-10" />

        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="eyebrow rise text-gold-500">מדריך עצמאי</p>

            <h1
              className="display rise mt-5 text-[clamp(2.35rem,6.2vw,4.25rem)] text-white"
              style={{ animationDelay: "90ms" }}
            >
              כל מה שהמערכת הסולארית שלכם
              <br />
              לא מספרת לכם
            </h1>

            <p
              className="rise mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/80 sm:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              תפוקה, ניקיון, תקלות וכלכלה — בשפה ברורה, עם מספרים שאפשר לבדוק.
              בלי הצעות מחיר ובלי מכירות.
            </p>

            <div
              className="rise mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "270ms" }}
            >
              <Link
                href="/madrichim"
                className="rounded-full bg-gold-500 px-7 py-3.5 font-bold text-navy-900 transition hover:bg-white"
              >
                קראו את המדריכים
              </Link>
              <Link
                href="#cleaning-calculator"
                className="rounded-full border border-white/35 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
              >
                כמה אתם מפסידים מלכלוך?
              </Link>
            </div>

            <dl
              className="rise mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-white/20 pt-6"
              style={{ animationDelay: "360ms" }}
            >
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="unit text-xl font-semibold text-white">
                    {s.value}
                  </dd>
                  <span className="text-sm text-white/60">{s.label}</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Topics — the module ---------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-700">ארבעה נושאים</p>
            <h2 className="display mt-4 text-[clamp(1.75rem,3.4vw,2.6rem)] text-heading">
              מה תרצו לדעת?
            </h2>
          </div>
          <Link
            href="/madrichim"
            className="text-[0.9375rem] font-semibold text-navy-500 underline-offset-4 hover:underline"
          >
            כל המדריכים ←
          </Link>
        </div>

        <TopicModule counts={counts} />
      </section>

      {/* Latest guides ----------------------------------------------------- */}
      {latest.length > 0 && (
        <section className="border-y border-line bg-paper py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <p className="eyebrow text-gold-700">פורסם לאחרונה</p>
            <h2 className="display mt-4 mb-10 text-[clamp(1.75rem,3.4vw,2.6rem)] text-heading">
              מדריכים אחרונים
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <article key={a.slug}>
                  <Link href={`/madrichim/${a.slug}`} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-navy-900">
                      <CoverImage
                        src={a.cover_image_url}
                        fallback={getArticlePhoto(a.topic, a.slug)}
                        alt={a.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {a.topic && (
                        <span className="unit text-[0.6875rem] uppercase tracking-[0.14em] text-gold-700">
                          {TOPIC_LABELS[a.topic]}
                        </span>
                      )}
                      <span className="unit text-[0.6875rem] text-muted">
                        {estimateReadingMinutes(a.content)} דק׳
                      </span>
                    </div>

                    <h3 className="display mt-2 text-[1.3rem] leading-tight text-foreground transition-colors group-hover:text-navy-500">
                      {a.title}
                    </h3>

                    {a.excerpt && (
                      <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted">
                        {a.excerpt}
                      </p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools -------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-4xl px-5 py-20 sm:py-24">
        <p className="eyebrow text-gold-700">מחשבונים</p>
        <h2 className="display mt-4 mb-3 text-[clamp(1.75rem,3.4vw,2.6rem)] text-heading">
          תריצו את המספרים שלכם
        </h2>
        <p className="mb-10 max-w-xl text-muted">
          שתי הערכות מהירות על בסיס נתוני ייצור ותעריף ממוצעים בישראל.
        </p>

        <div className="flex flex-col gap-8">
          <div id="cleaning-calculator" className="scroll-mt-24">
            <CleaningLossCalculator />
          </div>
          <div id="roi-calculator" className="scroll-mt-24">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* SunWise ------------------------------------------------------------ */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={settings?.sunwise_banner_image_url ?? PHOTOS.panelRowsDusk}
          alt="שורות פאנלים סולאריים באור נמוך"
          fill
          sizes="100vw"
          placeholder={
            settings?.sunwise_banner_image_url ? undefined : "blur"
          }
          className="-z-10 object-cover"
        />
        <div className="scrim-band absolute inset-0 -z-10" />

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold-500">גילוי נאות · שירות בבעלותנו</p>
            <h2 className="display mt-5 text-[clamp(1.85rem,4vw,3rem)] text-white">
              אל תגלו על תקלה
              <br />
              רק כשמגיע החשבון
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-white/75">
              מערכת סולארית לא מודיעה כשהיא מפסיקה לייצר כמו שצריך. SunWise עוקבת
              אחרי התפוקה ומתריעה כשמשהו משתנה.
            </p>
            <a
              href={SUNWISE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-3.5 font-bold text-navy-900 transition hover:bg-white"
            >
              נסו 30 יום בחינם
            </a>
          </div>

          <ul className="flex flex-col gap-px overflow-hidden rounded-md border border-white/15 bg-white/10 backdrop-blur-sm">
            {SUNWISE_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 bg-navy-900/40 px-5 py-4 text-[0.9375rem] text-white/90"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Professionals ------------------------------------------------------ */}
      <section className="mx-auto w-full max-w-6xl flex-1 px-5 py-20 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-700">תוכן ממומן</p>
            <h2 className="display mt-4 text-[clamp(1.75rem,3.4vw,2.6rem)] text-heading">
              בעלי מקצוע
            </h2>
          </div>
          <Link
            href="/about"
            className="text-[0.9375rem] font-semibold text-navy-500 underline-offset-4 hover:underline"
          >
            איך זה עובד ←
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/baalei-miktzoa/${c.slug}`}
              className="group overflow-hidden rounded-md border border-line bg-card transition hover:border-silver-500"
            >
              <div className="relative aspect-[5/2] overflow-hidden bg-navy-900">
                <CoverImage
                  fallback={getCategoryPhoto(c.slug)}
                  alt={c.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="opacity-85 transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground group-hover:text-navy-500">
                  {c.name}
                </h3>
                {c.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
