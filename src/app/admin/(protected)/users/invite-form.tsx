"use client";

import { useActionState } from "react";
import { inviteAdmin, type ActionState } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    inviteAdmin,
    {},
  );

  return (
    <form action={formAction} className="mb-8 flex max-w-md flex-col gap-3">
      {state.error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}
      <label className="text-sm">
        אימייל להזמנה
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded border border-border px-3 py-2"
        />
      </label>
      <label className="text-sm">
        תפקיד
        <select name="role" defaultValue="editor" className="mt-1 w-full rounded border border-border px-3 py-2">
          <option value="editor">עורך (editor)</option>
          <option value="owner">בעלים (owner)</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "שולח הזמנה..." : "שליחת הזמנה"}
      </button>
    </form>
  );
}
