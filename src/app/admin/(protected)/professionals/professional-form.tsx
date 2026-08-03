"use client";

import { useActionState } from "react";
import type { ActionState } from "./actions";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Professional = Database["public"]["Tables"]["professionals"]["Row"];

export function ProfessionalForm({
  categories,
  professional,
  action,
}: {
  categories: Category[];
  professional?: Professional;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state.error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <label className="text-sm">
        קטגוריה
        <select
          name="category_id"
          required
          defaultValue={professional?.category_id}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        >
          <option value="" disabled>
            בחירת קטגוריה
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        שם
        <input
          name="name"
          required
          defaultValue={professional?.name}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        Slug (כתובת URL, אופציונלי - ייווצר אוטומטית מהשם)
        <input
          name="slug"
          defaultValue={professional?.slug}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        תיאור
        <textarea
          name="description"
          rows={4}
          defaultValue={professional?.description ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        לוגו {professional?.logo_url && "(העלאת קובץ תחליף את הקיים)"}
        <input
          name="logo"
          type="file"
          accept="image/*"
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
        {professional?.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={professional.logo_url}
            alt=""
            className="mt-2 h-12 w-12 rounded object-contain"
          />
        )}
      </label>

      <label className="text-sm">
        טלפון
        <input
          name="phone"
          defaultValue={professional?.phone ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        WhatsApp
        <input
          name="whatsapp"
          defaultValue={professional?.whatsapp ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        אתר אינטרנט
        <input
          name="website"
          defaultValue={professional?.website ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        אזורי שירות
        <input
          name="service_areas"
          defaultValue={professional?.service_areas ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="is_house_brand"
          type="checkbox"
          defaultChecked={professional?.is_house_brand}
        />
        זהו שירות בבעלות מפעילי האתר (למשל SUNWISE)
      </label>

      <label className="text-sm">
        טקסט גילוי נאות (מוצג בפרופיל אם מדובר בשירות בית)
        <input
          name="disclosure_text"
          defaultValue={professional?.disclosure_text ?? ""}
          placeholder="לדוגמה: שירות שבבעלות מפעילי האתר"
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="is_active"
          type="checkbox"
          defaultChecked={professional?.is_active ?? true}
        />
        פעיל (מוצג באתר)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "שומר..." : "שמירה"}
      </button>
    </form>
  );
}
