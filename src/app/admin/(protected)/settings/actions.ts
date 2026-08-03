"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";

export interface ActionState {
  error?: string;
  success?: boolean;
}

const IMAGE_FIELDS = [
  "hero_image_url",
  "topic_production_image_url",
  "topic_maintenance_image_url",
  "topic_economics_image_url",
  "topic_troubleshooting_image_url",
  "sunwise_banner_image_url",
] as const;

type ImageField = (typeof IMAGE_FIELDS)[number];

export async function updateSiteSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const updates: Partial<Record<ImageField, string>> = {};

  for (const field of IMAGE_FIELDS) {
    const file = formData.get(field);
    if (file instanceof File && file.size > 0) {
      const path = `settings/${field}-${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        return { error: `העלאת התמונה נכשלה (${field}): ${uploadError.message}` };
      }
      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
      updates[field] = publicUrl.publicUrl;
    }
  }

  if (Object.keys(updates).length === 0) {
    return { error: "לא נבחרה אף תמונה להעלאה" };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/madrichim");
  return { success: true };
}
