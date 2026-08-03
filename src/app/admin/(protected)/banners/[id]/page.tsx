import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "../banner-form";
import { updateBanner } from "../actions";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: banner }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("banners").select("*").eq("id", id).single(),
  ]);

  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">עריכת באנר</h1>
      <BannerForm
        categories={categories ?? []}
        banner={banner}
        action={updateBanner.bind(null, id)}
      />
    </div>
  );
}
