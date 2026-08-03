"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/slug";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import type { ArticleTopic, FaqItem } from "@/lib/supabase/types";

export interface ActionState {
  error?: string;
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function fieldOrNull(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

const VALID_TOPICS: ArticleTopic[] = [
  "production",
  "maintenance",
  "economics",
  "troubleshooting",
];

function parseTopic(formData: FormData): ArticleTopic | null {
  const raw = String(formData.get("topic") ?? "");
  return (VALID_TOPICS as string[]).includes(raw) ? (raw as ArticleTopic) : null;
}

async function uploadCoverImage(
  supabase: SupabaseServerClient,
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  const path = `articles/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`העלאת תמונת הנושא נכשלה: ${error.message}`);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
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
    content: sanitizeArticleHtml(String(formData.get("content") ?? "")),
    excerpt: fieldOrNull(formData, "excerpt"),
    meta_description: fieldOrNull(formData, "meta_description"),
    related_category_id: fieldOrNull(formData, "related_category_id"),
    related_article_id: fieldOrNull(formData, "related_article_id"),
    topic: parseTopic(formData),
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

  let coverImageUrl: string | null = null;
  try {
    coverImageUrl = await uploadCoverImage(supabase, formData.get("cover_image"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "שגיאה בהעלאת תמונת הנושא" };
  }

  const { error } = await supabase.from("articles").insert({
    ...fields,
    cover_image_url: coverImageUrl,
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

  let coverImageUrl: string | undefined;
  try {
    coverImageUrl = await uploadCoverImage(supabase, formData.get("cover_image")) ?? undefined;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "שגיאה בהעלאת תמונת הנושא" };
  }

  const { error } = await supabase
    .from("articles")
    .update({
      ...fields,
      ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
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
