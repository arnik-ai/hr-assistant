"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * دکمه‌ی برگشت سازگار با RTL و موبایل (اندروید/iOS).
 * در RTL، فلش به سمت راست = برگشت. اگر تاریخچه‌ای نبود، به fallback می‌رود.
 */
export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={goBack}
      aria-label="برگشت"
      title="برگشت"
      className="flex items-center gap-1.5 rounded-xl border border-brand-400/40 px-3 py-2 text-[13px] text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
    >
      <ArrowRight className="h-5 w-5" />
      <span className="hidden sm:inline">برگشت</span>
    </button>
  );
}
