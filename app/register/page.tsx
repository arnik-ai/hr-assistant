"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, UserPlus, Loader2 } from "lucide-react";
import AuthShell, { Field } from "@/components/AuthShell";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    setLoading(true);
    try {
      await register({
        organization_name: organizationName,
        full_name: fullName,
        email,
        password,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت‌نام ناموفق بود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="ثبت سازمان جدید"
      subtitle="اولین کاربر، مدیر (ادمین) سازمان خواهد بود"
      footer={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-semibold text-brand-300 hover:text-brand-200">
            ورود
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="نام سازمان / شرکت"
          value={organizationName}
          onChange={setOrganizationName}
          placeholder="مثلاً نیکان ایمن سلامت"
        />
        <Field
          label="نام و نام خانوادگی"
          value={fullName}
          onChange={setFullName}
          placeholder="نام کامل شما"
          autoComplete="name"
        />
        <Field
          label="ایمیل"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <Field
          label="رمز عبور (حداقل ۸ کاراکتر)"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-[13px] text-red-300 ring-1 ring-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !organizationName || !fullName || !email || !password}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition enabled:hover:shadow-glow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {loading ? "در حال ثبت…" : "ثبت سازمان"}
        </button>
      </form>
    </AuthShell>
  );
}
