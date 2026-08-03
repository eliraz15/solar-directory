"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { BannerPlacement } from "@/lib/supabase/types";

export interface ActionState {
  error?: string;
}

function fieldOrNull(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function toIso(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function createBanner(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const linkUrl = fieldOrNull(formData, "link_url");
  const placement = String(formData.get("placement") ?? "") as BannerPlacement;
  const imageFile = formData.get("image");

  if (!linkUrl || !placement) {
    return { error: "יש למלא קישור ומיקום" };
  }
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { error: "יש להעלות תמונה" };
  }

  const path = `banners/${crypto.randomUUID()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, imageFile, { cacheControl: "3600", upsert: false });
  if (uploadError) {
    return { error: `העלאת התמונה נכשלה: ${uploadError.message}` };
  }
  const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);

  const { error } = await supabase.from("banners").insert({
    image_url: publicUrl.publicUrl,
    link_url: linkUrl,
    placement,
    category_id: fieldOrNull(formData, "category_id"),
    starts_at: toIso(fieldOrNull(formData, "starts_at")),
    ends_at: toIso(fieldOrNull(formData, "ends_at")),
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBanner(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const linkUrl = fieldOrNull(formData, "link_url");
  const placement = String(formData.get("placement") ?? "") as BannerPlacement;

  if (!linkUrl || !placement) {
    return { error: "יש למלא קישור ומיקום" };
  }

  let imageUrl: string | undefined;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const path = `banners/${crypto.randomUUID()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, imageFile, { cacheControl: "3600", upsert: false });
    if (uploadError) {
      return { error: `העלאת התמונה נכשלה: ${uploadError.message}` };
    }
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    imageUrl = publicUrl.publicUrl;
  }

  const { error } = await supabase
    .from("banners")
    .update({
      link_url: linkUrl,
      placement,
      category_id: fieldOrNull(formData, "category_id"),
      starts_at: toIso(fieldOrNull(formData, "starts_at")),
      ends_at: toIso(fieldOrNull(formData, "ends_at")),
      is_active: formData.get("is_active") === "on",
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
}

export async function toggleBannerActive(id: string, nextActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("banners").update({ is_active: nextActive }).eq("id", id);
  revalidatePath("/admin/banners");
}
