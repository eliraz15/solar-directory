import { createClient } from "@/lib/supabase/server";
import type { BannerPlacement } from "@/lib/supabase/types";

/**
 * Picks a fair rotation candidate among active, in-window banners for a
 * placement: whichever has the fewest impressions in the last 24h wins,
 * ties broken randomly, so no single paid slot dominates the rotation.
 */
export async function pickBanner(placement: BannerPlacement, categoryId?: string | null) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase.from("banners").select("*").eq("placement", placement).eq("is_active", true);
  query = categoryId ? query.or(`category_id.eq.${categoryId},category_id.is.null`) : query.is("category_id", null);

  const { data: banners } = await query;
  const eligible = (banners ?? []).filter((b) => {
    if (b.starts_at && b.starts_at > now) return false;
    if (b.ends_at && b.ends_at < now) return false;
    return true;
  });

  if (eligible.length === 0) return null;
  if (eligible.length === 1) return eligible[0];

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: events } = await supabase
    .from("banner_events")
    .select("banner_id")
    .eq("event_type", "impression")
    .in(
      "banner_id",
      eligible.map((b) => b.id),
    )
    .gte("created_at", since);

  const counts = new Map<string, number>();
  for (const b of eligible) counts.set(b.id, 0);
  for (const e of events ?? []) counts.set(e.banner_id, (counts.get(e.banner_id) ?? 0) + 1);

  const minCount = Math.min(...counts.values());
  const leastShown = eligible.filter((b) => counts.get(b.id) === minCount);
  return leastShown[Math.floor(Math.random() * leastShown.length)];
}
