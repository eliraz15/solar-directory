import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "../banner-form";
import { createBanner } from "../actions";

export default async function NewBannerPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">הוספת באנר</h1>
      <BannerForm categories={categories ?? []} action={createBanner} />
    </div>
  );
}
