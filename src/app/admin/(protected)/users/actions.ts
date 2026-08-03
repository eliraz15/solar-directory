"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@/lib/supabase/types";

export interface ActionState {
  error?: string;
}

export async function inviteAdmin(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireOwner();

  const email = String(formData.get("email") ?? "").trim();
  const role = (formData.get("role") === "owner" ? "owner" : "editor") as AdminRole;
  if (!email) return { error: "יש להזין אימייל" };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error || !data.user) {
    return { error: error?.message ?? "שליחת ההזמנה נכשלה" };
  }

  const { error: profileError } = await admin
    .from("admin_profiles")
    .insert({ user_id: data.user.id, role });

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/users");
  return {};
}

export async function updateRole(userId: string, role: AdminRole) {
  const owner = await requireOwner();
  if (userId === owner.userId) return; // can't change own role

  const admin = createAdminClient();
  await admin.from("admin_profiles").update({ role }).eq("user_id", userId);
  revalidatePath("/admin/users");
}

export async function toggleSuspend(userId: string, nextSuspended: boolean) {
  const owner = await requireOwner();
  if (userId === owner.userId) return; // can't suspend self

  const admin = createAdminClient();
  await admin
    .from("admin_profiles")
    .update({ is_suspended: nextSuspended })
    .eq("user_id", userId);
  revalidatePath("/admin/users");
}
