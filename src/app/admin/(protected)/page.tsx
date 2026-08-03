import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [professionals, articles, banners, events] = await Promise.all([
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("articles").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("banners").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("banner_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    professionals: professionals.count ?? 0,
    articles: articles.count ?? 0,
    banners: banners.count ?? 0,
    eventsLast7Days: events.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "בעלי מקצוע פעילים", value: counts.professionals },
    { label: "מאמרים מפורסמים", value: counts.articles },
    { label: "באנרים פעילים", value: counts.banners },
    { label: "אירועי באנר (7 ימים)", value: counts.eventsLast7Days },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">דשבורד</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border p-4">
            <div className="text-3xl font-semibold text-brand">{card.value}</div>
            <div className="mt-1 text-sm text-muted">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
