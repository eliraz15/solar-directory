import { requireOwner } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { InviteForm } from "./invite-form";
import { updateRole, toggleSuspend } from "./actions";

export default async function UsersPage() {
  const currentAdmin = await requireOwner();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: profiles } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at");

  const { data: authUsers } = await admin.auth.admin.listUsers();
  const emailByUserId = new Map(authUsers?.users.map((u) => [u.id, u.email]) ?? []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">משתמשי ניהול</h1>

      <InviteForm />

      <div className="overflow-x-auto rounded-lg border border-border max-w-2xl">
        <table className="w-full text-sm">
          <thead className="bg-border/30 text-right">
            <tr>
              <th className="p-3">אימייל</th>
              <th className="p-3">תפקיד</th>
              <th className="p-3">סטטוס</th>
              <th className="p-3">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => {
              const isSelf = p.user_id === currentAdmin.userId;
              return (
                <tr key={p.user_id} className="border-t border-border">
                  <td className="p-3">
                    {emailByUserId.get(p.user_id) ?? p.user_id}
                    {isSelf && <span className="mr-2 text-xs text-muted">(אתה)</span>}
                  </td>
                  <td className="p-3">
                    <form
                      action={updateRole.bind(
                        null,
                        p.user_id,
                        p.role === "owner" ? "editor" : "owner",
                      )}
                    >
                      <button
                        type="submit"
                        disabled={isSelf}
                        className="rounded bg-border/50 px-2 py-1 disabled:opacity-40"
                      >
                        {p.role === "owner" ? "בעלים" : "עורך"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <form action={toggleSuspend.bind(null, p.user_id, !p.is_suspended)}>
                      <button
                        type="submit"
                        disabled={isSelf}
                        className={
                          p.is_suspended
                            ? "rounded bg-red-50 px-2 py-1 text-red-700 disabled:opacity-40"
                            : "rounded bg-brand/10 px-2 py-1 text-brand disabled:opacity-40"
                        }
                      >
                        {p.is_suspended ? "מושעה" : "פעיל"}
                      </button>
                    </form>
                  </td>
                  <td className="p-3 text-xs text-muted">
                    {isSelf ? "לא ניתן לשנות משתמש עצמי" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
