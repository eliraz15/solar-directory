import { createClient } from "@/lib/supabase/server";
import { ProfessionalForm } from "../professional-form";
import { createProfessional } from "../actions";

export default async function NewProfessionalPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">הוספת בעל מקצוע</h1>
      <ProfessionalForm categories={categories ?? []} action={createProfessional} />
    </div>
  );
}
