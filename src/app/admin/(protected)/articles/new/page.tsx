import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">מאמר חדש</h1>
      <ArticleForm categories={categories ?? []} action={createArticle} />
    </div>
  );
}
