import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteBanner, toggleBannerActive } from "./actions";

const PLACEMENT_LABELS: Record<string, string> = {
  article_inline: "בתוך מאמר",
  sidebar: "סרגל צד",
  category_top: "עליון בדף קטגוריה",
  homepage: "דף הבית",
};

export default async function BannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">באנרים</h1>
        <Link
          href="/admin/banners/new"
          className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark"
        >
          + הוספת באנר
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-border/30 text-right">
            <tr>
              <th className="p-3">תמונה</th>
              <th className="p-3">מיקום</th>
              <th className="p-3">תוקף</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(banners ?? []).map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image_url} alt="" className="h-10 rounded object-contain" />
                </td>
                <td className="p-3">{PLACEMENT_LABELS[b.placement] ?? b.placement}</td>
                <td className="p-3 text-xs text-muted">
                  {b.starts_at ? new Date(b.starts_at).toLocaleDateString("he-IL") : "—"}
                  {" עד "}
                  {b.ends_at ? new Date(b.ends_at).toLocaleDateString("he-IL") : "ללא הגבלה"}
                </td>
                <td className="p-3">
                  <form action={toggleBannerActive.bind(null, b.id, !b.is_active)}>
                    <button
                      type="submit"
                      className={
                        b.is_active
                          ? "rounded bg-brand/10 px-2 py-1 text-brand"
                          : "rounded bg-border/50 px-2 py-1 text-muted"
                      }
                    >
                      {b.is_active ? "פעיל" : "מושבת"}
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/banners/${b.id}`} className="text-brand underline">
                      עריכה
                    </Link>
                    <Link
                      href={`/admin/banners/${b.id}/analytics`}
                      className="text-brand underline"
                    >
                      אנליטיקס
                    </Link>
                    <form action={deleteBanner.bind(null, b.id)}>
                      <button type="submit" className="text-red-600 underline">
                        מחיקה
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
