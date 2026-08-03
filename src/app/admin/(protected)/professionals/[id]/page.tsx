import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalForm } from "../professional-form";
import { updateProfessional } from "../actions";

export default async function EditProfessionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: professional }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("professionals").select("*").eq("id", id).single(),
  ]);

  if (!professional) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">עריכת בעל מקצוע</h1>
      <ProfessionalForm
        categories={categories ?? []}
        professional={professional}
        action={updateProfessional.bind(null, id)}
      />
    </div>
  );
}
