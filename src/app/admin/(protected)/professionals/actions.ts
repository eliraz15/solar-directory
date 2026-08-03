"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";

export interface ActionState {
  error?: string;
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function uploadLogo(
  supabase: SupabaseServerClient,
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  const path = `professionals/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`העלאת הלוגו נכשלה: ${error.message}`);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

async function nextAvailableSlot(
  supabase: SupabaseServerClient,
  categoryId: string,
  excludeId?: string,
): Promise<number | null> {
  const { data } = await supabase
    .from("professionals")
    .select("id, slot_position")
    .eq("category_id", categoryId)
    .eq("is_active", true);

  const used = new Set(
    (data ?? [])
      .filter((p) => p.id !== excludeId)
      .map((p) => p.slot_position)
      .filter((slot): slot is number => slot !== null),
  );

  for (const slot of [1, 2, 3]) {
    if (!used.has(slot)) return slot;
  }
  return null;
}

function fieldOrNull(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

export async function createProfessional(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const categoryId = String(formData.get("category_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const isActive = formData.get("is_active") === "on";
  const isHouseBrand = formData.get("is_house_brand") === "on";

  if (!categoryId || !name) {
    return { error: "יש למלא קטגוריה ושם" };
  }

  let slotPosition: number | null = null;
  if (isActive && !isHouseBrand) {
    slotPosition = await nextAvailableSlot(supabase, categoryId);
    if (slotPosition === null) {
      return {
        error: "כל 3 הסלוטים בקטגוריה הזו תפוסים. השבת בעל מקצוע אחר קודם.",
      };
    }
  }

  let logoUrl: string | null = null;
  try {
    logoUrl = await uploadLogo(supabase, formData.get("logo"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "שגיאה בהעלאת הלוגו" };
  }

  const slugInput = fieldOrNull(formData, "slug") ?? name;

  const { error } = await supabase.from("professionals").insert({
    category_id: categoryId,
    name,
    slug: slugify(slugInput),
    description: fieldOrNull(formData, "description"),
    logo_url: logoUrl,
    phone: fieldOrNull(formData, "phone"),
    whatsapp: fieldOrNull(formData, "whatsapp"),
    website: fieldOrNull(formData, "website"),
    service_areas: fieldOrNull(formData, "service_areas"),
    is_active: isActive,
    slot_position: slotPosition,
    is_house_brand: isHouseBrand,
    disclosure_text: fieldOrNull(formData, "disclosure_text"),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/professionals");
  redirect("/admin/professionals");
}

export async function updateProfessional(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const categoryId = String(formData.get("category_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const isActive = formData.get("is_active") === "on";
  const isHouseBrand = formData.get("is_house_brand") === "on";

  if (!categoryId || !name) {
    return { error: "יש למלא קטגוריה ושם" };
  }

  let slotPosition: number | null = null;
  if (isActive && !isHouseBrand) {
    slotPosition = await nextAvailableSlot(supabase, categoryId, id);
    if (slotPosition === null) {
      return {
        error: "כל 3 הסלוטים בקטגוריה הזו תפוסים. השבת בעל מקצוע אחר קודם.",
      };
    }
  }

  let logoUrl: string | null | undefined;
  try {
    logoUrl = await uploadLogo(supabase, formData.get("logo"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "שגיאה בהעלאת הלוגו" };
  }

  const slugInput = fieldOrNull(formData, "slug") ?? name;

  const { error } = await supabase
    .from("professionals")
    .update({
      category_id: categoryId,
      name,
      slug: slugify(slugInput),
      description: fieldOrNull(formData, "description"),
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      phone: fieldOrNull(formData, "phone"),
      whatsapp: fieldOrNull(formData, "whatsapp"),
      website: fieldOrNull(formData, "website"),
      service_areas: fieldOrNull(formData, "service_areas"),
      is_active: isActive,
      slot_position: slotPosition,
      is_house_brand: isHouseBrand,
      disclosure_text: fieldOrNull(formData, "disclosure_text"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/professionals");
  redirect("/admin/professionals");
}

export async function deleteProfessional(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("professionals").delete().eq("id", id);
  revalidatePath("/admin/professionals");
}

export async function toggleProfessionalActive(id: string, nextActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  if (!nextActive) {
    await supabase
      .from("professionals")
      .update({ is_active: false, slot_position: null })
      .eq("id", id);
    revalidatePath("/admin/professionals");
    return;
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("category_id, is_house_brand")
    .eq("id", id)
    .single();

  if (!professional) return;

  let slotPosition: number | null = null;
  if (!professional.is_house_brand) {
    slotPosition = await nextAvailableSlot(supabase, professional.category_id, id);
    if (slotPosition === null) {
      // Silently no-op: the UI already disables this action at 3/3, this
      // only matters if two admins race each other.
      return;
    }
  }

  await supabase
    .from("professionals")
    .update({ is_active: true, slot_position: slotPosition })
    .eq("id", id);
  revalidatePath("/admin/professionals");
}
