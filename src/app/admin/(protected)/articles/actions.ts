"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";
import type { FaqItem } from "@/lib/supabase/types";

export interface ActionState {
  error?: string;
}

function fieldOrNull(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function parseFaqItems(formData: FormData): FaqItem[] {
  const raw = String(formData.get("faq_items") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.question === "string" && typeof item.answer === "string")
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question && item.answer);
  } catch {
    return [];
  }
}

function buildFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";
  const slugInput = fieldOrNull(formData, "slug") ?? title;

  return {
    title,
    slug: slugify(slugInput),
    content: DOMPurify.sanitize(String(formData.get("content") ?? "")),
    excerpt: fieldOrNull(formData, "excerpt"),
    meta_description: fieldOrNull(formData, "meta_description"),
    related_category_id: fieldOrNull(formData, "related_category_id"),
    status: status as "draft" | "published",
    faq_items: parseFaqItems(formData),
  };
}

export async function createArticle(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = buildFields(formData);

  if (!fields.title) return { error: "יש למלא כותרת" };

  const { error } = await supabase.from("articles").insert({
    ...fields,
    published_at: fields.status === "published" ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = buildFields(formData);

  if (!fields.title) return { error: "יש למלא כותרת" };

  const { data: existing } = await supabase
    .from("articles")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const publishedAt =
    fields.status === "published"
      ? (existing?.published_at ?? new Date().toISOString())
      : null;

  const { error } = await supabase
    .from("articles")
    .update({
      ...fields,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/admin/articles");
}
