import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../article-form";
import { updateArticle } from "../actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: article }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("articles").select("*").eq("id", id).single(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">עריכת מאמר</h1>
      <ArticleForm
        categories={categories ?? []}
        article={article}
        action={updateArticle.bind(null, id)}
      />
    </div>
  );
}
