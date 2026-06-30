"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, LogIn, Loader2 } from "lucide-react";
import AuthShell, { Field } from "@/components/AuthShell";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="ورود به حساب"
      subtitle="دستیار هوشمند منابع انسانی"
      footer={
        <>
          حساب ندارید؟{" "}
          <Link href="/register" className="font-semibold text-brand-300 hover:text-brand-200">
            ثبت سازمان جدید
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="ایمیل"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Field
          label="رمز عبور"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-[13px] text-red-300 ring-1 ring-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition enabled:hover:shadow-glow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {loading ? "در حال ورود…" : "ورود"}
        </button>
      </form>
    </AuthShell>
  );
}
