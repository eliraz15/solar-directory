import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProfessional, toggleProfessionalActive } from "./actions";

export default async function ProfessionalsPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const { data: professionals } = await supabase
    .from("professionals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">בעלי מקצוע</h1>
        <Link
          href="/admin/professionals/new"
          className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark"
        >
          + הוספת בעל מקצוע
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {(categories ?? []).map((category) => {
          const items = (professionals ?? []).filter(
            (p) => p.category_id === category.id,
          );
          const activeCount = items.filter((p) => p.is_active).length;

          return (
            <section key={category.id}>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-medium">
                {category.name}
                {!category.is_exclusive && (
                  <span className="rounded-full bg-border/60 px-2 py-0.5 text-xs text-muted">
                    {activeCount}/3 סלוטים תפוסים
                  </span>
                )}
                {category.is_exclusive && (
                  <span className="rounded-full bg-sun/20 px-2 py-0.5 text-xs text-sun">
                    קטגוריה בלעדית
                  </span>
                )}
              </h2>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-border/30 text-right">
                    <tr>
                      <th className="p-3">שם</th>
                      <th className="p-3">סלוט</th>
                      <th className="p-3">סטטוס</th>
                      <th className="p-3">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-muted">
                          אין עדיין בעלי מקצוע בקטגוריה זו
                        </td>
                      </tr>
                    )}
                    {items.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="p-3">
                          {p.name}
                          {p.is_house_brand && (
                            <span className="mr-2 text-xs text-sun">
                              (השירות שלנו)
                            </span>
                          )}
                        </td>
                        <td className="p-3">{p.slot_position ?? "—"}</td>
                        <td className="p-3">
                          <form
                            action={toggleProfessionalActive.bind(
                              null,
                              p.id,
                              !p.is_active,
                            )}
                          >
                            <button
                              type="submit"
                              className={
                                p.is_active
                                  ? "rounded bg-brand/10 px-2 py-1 text-brand"
                                  : "rounded bg-border/50 px-2 py-1 text-muted"
                              }
                            >
                              {p.is_active ? "פעיל" : "מושבת"}
                            </button>
                          </form>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-3">
                            <Link
                              href={`/admin/professionals/${p.id}`}
                              className="text-brand underline"
                            >
                              עריכה
                            </Link>
                            <form action={deleteProfessional.bind(null, p.id)}>
                              <button
                                type="submit"
                                className="text-red-600 underline"
                              >
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
