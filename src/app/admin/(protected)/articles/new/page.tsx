import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: otherArticles }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("articles").select("id, title").order("title"),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">מאמר חדש</h1>
      <ArticleForm
        categories={categories ?? []}
        otherArticles={otherArticles ?? []}
        action={createArticle}
      />
    </div>
  );
}
