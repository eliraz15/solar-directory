import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/supabase/types";

export interface CurrentAdmin {
  userId: string;
  email: string | null;
  role: AdminRole;
}

/**
 * Verifies the current request belongs to a non-suspended admin_profiles
 * row. Redirects to /admin/login otherwise - middleware only checks that
 * a session exists, not that it's an actual (non-suspended) admin.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role, is_suspended")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.is_suspended) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not_authorized");
  }

  return { userId: user.id, email: user.email ?? null, role: profile.role };
}

export async function requireOwner(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== "owner") {
    redirect("/admin?error=owner_only");
  }
  return admin;
}
