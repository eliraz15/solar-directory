"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  not_authorized: "המשתמש הזה אינו מורשה לגשת לממשק הניהול",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    ERROR_MESSAGES[searchParams.get("error") ?? ""] ?? null,
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("אימייל או סיסמה שגויים");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border p-6"
      >
        <h1 className="mb-6 text-xl font-semibold text-brand">
          כניסה לממשק ניהול
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-3 block text-sm">
          אימייל
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2"
          />
        </label>

        <label className="mb-4 block text-sm">
          סיסמה
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחברות"}
        </button>
      </form>
    </div>
  );
}
