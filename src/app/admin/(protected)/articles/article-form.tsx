"use client";

import { useActionState, useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { ActionState } from "./actions";
import type { Database, FaqItem } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Article = Database["public"]["Tables"]["articles"]["Row"];

function FaqEditor({ initial }: { initial: FaqItem[] }) {
  const [items, setItems] = useState<FaqItem[]>(initial.length ? initial : []);

  function update(index: number, key: keyof FaqItem, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  return (
    <div>
      <div className="mb-2 text-sm font-medium">שאלות ותשובות (FAQ)</div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="rounded border border-border p-3">
            <input
              value={item.question}
              onChange={(e) => update(index, "question", e.target.value)}
              placeholder="שאלה"
              className="mb-2 w-full rounded border border-border px-2 py-1 text-sm"
            />
            <textarea
              value={item.answer}
              onChange={(e) => update(index, "answer", e.target.value)}
              placeholder="תשובה"
              rows={2}
              className="w-full rounded border border-border px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
              className="mt-2 text-xs text-red-600 underline"
            >
              הסרה
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { question: "", answer: "" }])}
          className="w-fit rounded border border-border px-3 py-1 text-sm"
        >
          + הוספת שאלה
        </button>
      </div>
      <input type="hidden" name="faq_items" value={JSON.stringify(items)} readOnly />
    </div>
  );
}

export function ArticleForm({
  categories,
  article,
  action,
}: {
  categories: Category[];
  article?: Article;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      {state.error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}

      <label className="text-sm">
        כותרת
        <input
          name="title"
          required
          defaultValue={article?.title}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        Slug (אופציונלי - ייווצר אוטומטית מהכותרת)
        <input
          name="slug"
          defaultValue={article?.slug}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        תקציר
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article?.excerpt ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        Meta Description (ל-SEO)
        <textarea
          name="meta_description"
          rows={2}
          defaultValue={article?.meta_description ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        קטגוריית בעלי מקצוע קשורה (ל-CTA אוטומטי בתוך המאמר)
        <select
          name="related_category_id"
          defaultValue={article?.related_category_id ?? ""}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        >
          <option value="">ללא</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <div className="mb-1 text-sm">תוכן המאמר</div>
        <RichTextEditor name="content" defaultValue={article?.content} />
      </div>

      <FaqEditor initial={article?.faq_items ?? []} />

      <label className="text-sm">
        סטטוס
        <select
          name="status"
          defaultValue={article?.status ?? "draft"}
          className="mt-1 w-full rounded border border-border px-3 py-2"
        >
          <option value="draft">טיוטה</option>
          <option value="published">מפורסם</option>
        </select>
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
