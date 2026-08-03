import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { CoverImage } from "@/components/cover-image";
import { CleaningLossCalculator } from "@/components/cleaning-loss-calculator";
import { RoiCalculator } from "@/components/roi-calculator";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { TOPIC_ICONS, TOPIC_LABELS, TOPIC_ORDER, getTopicImage } from "@/lib/topics";
import { estimateReadingMinutes } from "@/lib/reading-time";

const SUNWISE_URL = "https://sunwise.co.il";

const BENEFITS = [
  "התראות WhatsApp",
  "AI לזיהוי תקלות",
  "המלצה לניקוי",
  "סיכום יומי",
  "מעקב תפוקה",
  "חיסכון של אלפי שקלים",
];

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: articles }, { data: settings }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("articles")
      .select("slug, title, excerpt, content, topic, cover_image_url")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.from("site_settings").select("*").eq("id", true).single(),
  ]);

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

      <section
        className={`relative text-white ${settings?.hero_image_url ? "" : "hero-gradient"}`}
        style={
          settings?.hero_image_url
            ? {
                backgroundImage: `linear-gradient(rgba(12,40,80,0.65), rgba(12,40,80,0.75)), url(${settings.hero_image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="mb-4 font-heading text-4xl font-extrabold sm:text-5xl">
            המדריך המקיף למערכות סולאריות בישראל
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/85">
            כל מה שצריך לדעת על התקנה, תפוקה, ניקיון, תחזוקה וחיסכון בחשבון החשמל.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/madrichim"
              className="btn-glow rounded-[14px] bg-sun px-8 py-3 font-bold text-brand-dark"
            >
              קראו מדריכים
            </Link>
            <a
              href={SUNWISE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow rounded-[14px] border-2 border-white/50 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur hover:bg-white/20"
            >
              בדקו את תפוקת המערכת שלכם
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-brand">
            מה תרצו לדעת?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOPIC_ORDER.map((topic) => (
              <Link
                key={topic}
                href={`/madrichim?topic=${topic}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CoverImage
                  src={getTopicImage(settings, topic)}
                  icon={TOPIC_ICONS[topic]}
                  alt={TOPIC_LABELS[topic]}
                  className="h-36 w-full"
                />
                <div className="p-5 text-center">
                  <h3 className="font-heading text-lg font-bold text-brand group-hover:underline">
                    {TOPIC_LABELS[topic]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="cleaning-calculator" className="mx-auto w-full max-w-3xl px-4 py-16">
        <CleaningLossCalculator />
      </section>

      {articles && articles.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-brand">
              מדריכים אחרונים
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/madrichim/${a.slug}`}
                  className="animate-fade-in-up group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
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
                    <h3 className="font-heading font-bold text-foreground group-hover:text-brand">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{a.excerpt}</p>
                    )}
                    <span className="mt-3 inline-block text-sm font-semibold text-brand">
                      קרא עוד ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="relative bg-brand-dark py-16 text-white"
        style={
          settings?.sunwise_banner_image_url
            ? {
                backgroundImage: `linear-gradient(rgba(8,26,51,0.75), rgba(8,26,51,0.85)), url(${settings.sunwise_banner_image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 font-heading text-3xl font-extrabold">יש לכם מערכת סולארית?</h2>
          <p className="mb-8 text-lg text-white/85">
            אל תגלו על תקלה רק כשמגיע חשבון החשמל.
          </p>
          <a
            href={SUNWISE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-block rounded-[14px] bg-sun px-10 py-4 text-lg font-bold text-brand-dark"
          >
            נסו את SunWise בחינם ל-30 יום
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center font-heading text-2xl font-extrabold text-brand">
          למה SunWise?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((label) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <span className="text-lg text-brand">✅</span>
              <span className="font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="roi-calculator" className="mx-auto w-full max-w-3xl px-4 py-16">
        <RoiCalculator />
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16">
        <h2 className="mb-6 font-heading text-2xl font-extrabold text-brand">
          בעלי מקצוע מומלצים
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              href={`/baalei-miktzoa/${c.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-2xl">
                {CATEGORY_ICONS[c.slug] ?? "☀️"}
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-brand">
                  {c.name}
                </h3>
                {c.description && <p className="mt-1 text-sm text-muted">{c.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
