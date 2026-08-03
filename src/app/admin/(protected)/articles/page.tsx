import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteArticle } from "./actions";

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">מאמרים</h1>
        <Link
          href="/admin/articles/new"
          className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark"
        >
          + מאמר חדש
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-border/30 text-right">
            <tr>
              <th className="p-3">כותרת</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">עודכן</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-3">{a.title}</td>
                <td className="p-3">
                  <span
                    className={
                      a.status === "published"
                        ? "rounded bg-brand/10 px-2 py-1 text-brand"
                        : "rounded bg-border/50 px-2 py-1 text-muted"
                    }
                  >
                    {a.status === "published" ? "מפורסם" : "טיוטה"}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted">
                  {new Date(a.updated_at).toLocaleDateString("he-IL")}
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/articles/${a.id}`} className="text-brand underline">
                      עריכה
                    </Link>
                    {a.status === "published" && (
                      <Link
                        href={`/madrichim/${a.slug}`}
                        target="_blank"
                        className="text-brand underline"
                      >
                        צפייה
                      </Link>
                    )}
                    <form action={deleteArticle.bind(null, a.id)}>
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
