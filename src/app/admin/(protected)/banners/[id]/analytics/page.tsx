import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const DAYS = 30;

function sinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export default async function BannerAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: banner } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single();

  if (!banner) notFound();

  const since = sinceIso(DAYS);
  const { data: events } = await supabase
    .from("banner_events")
    .select("event_type, created_at")
    .eq("banner_id", id)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const totalImpressions = (events ?? []).filter((e) => e.event_type === "impression").length;
  const totalClicks = (events ?? []).filter((e) => e.event_type === "click").length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "—";

  const byDay = new Map<string, { impressions: number; clicks: number }>();
  for (const event of events ?? []) {
    const day = event.created_at.slice(0, 10);
    const entry = byDay.get(day) ?? { impressions: 0, clicks: 0 };
    if (event.event_type === "impression") entry.impressions += 1;
    else entry.clicks += 1;
    byDay.set(day, entry);
  }
  const days = Array.from(byDay.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">אנליטיקס באנר</h1>
      <p className="mb-6 text-sm text-muted">{banner.link_url}</p>

      <div className="mb-8 grid grid-cols-3 gap-4 max-w-xl">
        <div className="rounded-lg border border-border p-4">
          <div className="text-3xl font-semibold text-brand">{totalImpressions}</div>
          <div className="mt-1 text-sm text-muted">צפיות ({DAYS} ימים)</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-3xl font-semibold text-brand">{totalClicks}</div>
          <div className="mt-1 text-sm text-muted">קליקים ({DAYS} ימים)</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-3xl font-semibold text-brand">{ctr}%</div>
          <div className="mt-1 text-sm text-muted">CTR</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border max-w-xl">
        <table className="w-full text-sm">
          <thead className="bg-border/30 text-right">
            <tr>
              <th className="p-3">תאריך</th>
              <th className="p-3">צפיות</th>
              <th className="p-3">קליקים</th>
            </tr>
          </thead>
          <tbody>
            {days.length === 0 && (
              <tr>
                <td colSpan={3} className="p-3 text-center text-muted">
                  אין עדיין נתונים
                </td>
              </tr>
            )}
            {days.map(([day, counts]) => (
              <tr key={day} className="border-t border-border">
                <td className="p-3">{new Date(day).toLocaleDateString("he-IL")}</td>
                <td className="p-3">{counts.impressions}</td>
                <td className="p-3">{counts.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
