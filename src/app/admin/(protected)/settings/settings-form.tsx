"use client";

import { useActionState } from "react";
import { updateSiteSettings, type ActionState } from "./actions";
import type { Database } from "@/lib/supabase/types";

type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

const FIELDS: { name: keyof SiteSettings; label: string; hint: string }[] = [
  {
    name: "hero_image_url",
    label: "תמונת רקע להירו בדף הבית",
    hint: "מומלץ: גג עם מערכת סולארית בזמן שקיעה",
  },
  {
    name: "topic_production_image_url",
    label: "תמונה לכרטיס: ייצור והספק",
    hint: "",
  },
  {
    name: "topic_maintenance_image_url",
    label: "תמונה לכרטיס: ניקיון ותחזוקה",
    hint: "",
  },
  {
    name: "topic_economics_image_url",
    label: "תמונה לכרטיס: חיסכון וכלכלה",
    hint: "",
  },
  {
    name: "topic_troubleshooting_image_url",
    label: "תמונה לכרטיס: תקלות ופתרונות",
    hint: "",
  },
  {
    name: "sunwise_banner_image_url",
    label: "תמונת רקע לבאנר SunWise",
    hint: "מומלץ: פאנלים סולאריים, רקע כהה",
  },
];

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateSiteSettings,
    {},
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      {state.error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state.success && (
        <div className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">
          התמונות עודכנו בהצלחה
        </div>
      )}

      {FIELDS.map((field) => {
        const currentUrl = settings?.[field.name] as string | null | undefined;
        return (
          <div key={field.name} className="rounded-lg border border-border p-4">
            <label className="text-sm font-medium">
              {field.label}
              {field.hint && <span className="mr-2 text-xs text-muted">({field.hint})</span>}
              <input
                name={field.name}
                type="file"
                accept="image/*"
                className="mt-2 block w-full rounded border border-border px-3 py-2 text-sm"
              />
            </label>
            {currentUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt=""
                className="mt-3 h-24 w-full rounded object-cover"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "מעלה..." : "שמירה"}
      </button>
    </form>
  );
}
