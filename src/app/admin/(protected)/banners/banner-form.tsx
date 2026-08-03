"use client";

import { useActionState } from "react";
import type { ActionState } from "./actions";
import type { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Banner = Database["public"]["Tables"]["banners"]["Row"];

const PLACEMENT_LABELS: Record<string, string> = {
  article_inline: "בתוך מאמר",
  sidebar: "סרגל צד",
  category_top: "עליון בדף קטגוריה",
  homepage: "דף הבית",
};

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function BannerForm({
  categories,
  banner,
  action,
}: {
  categories: Category[];
  banner?: Banner;
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
        תמונה {banner?.image_url && "(העלאת קובץ תחליף את הקיימת)"}
        <input
          name="image"
          type="file"
          accept="image/*"
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
        {banner?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.image_url}
            alt=""
            className="mt-2 h-16 rounded object-contain"
          />
        )}
      </label>

      <label className="text-sm">
        קישור יעד
        <input
          name="link_url"
          required
          defaultValue={banner?.link_url}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        מיקום
        <select
          name="placement"
          required
          defaultValue={banner?.placement}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        >
          <option value="" disabled>
            בחירת מיקום
          </option>
          {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        קטגוריה משויכת (אופציונלי)
        <select
          name="category_id"
          defaultValue={banner?.category_id ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        תאריך התחלה
        <input
          name="starts_at"
          type="datetime-local"
          defaultValue={toLocalInputValue(banner?.starts_at ?? null)}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        תאריך סיום
        <input
          name="ends_at"
          type="datetime-local"
          defaultValue={toLocalInputValue(banner?.ends_at ?? null)}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="is_active"
          type="checkbox"
          defaultChecked={banner?.is_active ?? true}
        />
        פעיל
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
