import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">הגדרות אתר</h1>
      <p className="mb-6 text-sm text-muted">
        תמונות אלה מוצגות באתר הציבורי. עד שיועלו תמונות אמיתיות, מוצגת תבנית עיצובית זמנית.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
