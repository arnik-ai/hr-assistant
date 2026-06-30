"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  ShieldAlert,
  AlertCircle,
  UserPlus,
  FileText,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import { getDashboardStats, type DashboardStats } from "@/lib/employees";

// کارت‌های آمار — هرکدام یک توضیح ساده دارد
const CARDS = [
  {
    key: "employees",
    label: "کل کارمندان",
    desc: "تعداد همه‌ی کارکنانی که ثبت کرده‌اید",
    icon: Users,
    color: "from-brand-400 to-brand-600",
  },
  {
    key: "active_employees",
    label: "کارمندان فعال",
    desc: "کسانی که الان مشغول کارند",
    icon: UserCheck,
    color: "from-emerald-400 to-teal-600",
  },
  {
    key: "open_positions",
    label: "آگهی‌های باز",
    desc: "موقعیت‌هایی که در حال جذب نیرو هستند",
    icon: Briefcase,
    color: "from-amber-400 to-orange-600",
  },
  {
    key: "risk_alerts",
    label: "هشدارهای ریسک",
    desc: "مواردی که باید به آن‌ها رسیدگی کنید",
    icon: ShieldAlert,
    color: "from-red-400 to-rose-600",
  },
] as const;

// کارهای سریع — دکمه‌های بزرگ و واضح
const ACTIONS = [
  {
    href: "/employees",
    title: "افزودن کارمند",
    desc: "یک کارمند جدید به سیستم اضافه کنید",
    icon: UserPlus,
    color: "from-brand-500 to-brand-600",
  },
  {
    href: "/recruitment",
    title: "استخدام نیرو",
    desc: "آگهی شغل بسازید و نامزدها را ببینید",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
  },
  {
    href: "/recruitment",
    title: "تولید شرح وظایف با هوش مصنوعی",
    desc: "هوش مصنوعی برایتان شرح وظایف می‌نویسد",
    icon: FileText,
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    href: "/",
    title: "پرسش از دستیار",
    desc: "سؤال قانون کار یا حقوق بپرسید",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-600",
  },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "خطا"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        {/* خوش‌آمد + توضیح صفحه */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-100">👋 خوش آمدید</h1>
          <p className="mt-1 text-sm text-slate-400">
            اینجا یک نگاه کلی به وضعیت شرکت شماست. برای شروع، یکی از «کارهای سریع» پایین را انتخاب کنید.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            برای دیدن اطلاعات، ابتدا باید وارد شوید —{" "}
            <Link href="/login" className="font-semibold underline">
              ورود به حساب
            </Link>
          </div>
        )}

        {/* آمار با توضیح */}
        <h2 className="mb-3 text-sm font-semibold text-slate-300">وضعیت کلی</h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-3xl border border-brand-400/40 p-5"
            >
              <div
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color}`}
              >
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-100">
                {loading ? "…" : stats ? (stats[c.key] as number) : "—"}
              </div>
              <div className="mt-1 text-[14px] font-medium text-slate-200">
                {c.label}
              </div>
              <div className="mt-0.5 text-[12px] leading-5 text-slate-400">
                {c.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* کارهای سریع */}
        <h2 className="mb-3 text-sm font-semibold text-slate-300">
          کارهای سریع — روی هرکدام بزنید
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACTIONS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
            >
              <Link
                href={a.href}
                className="group flex items-center gap-4 rounded-3xl border border-brand-400/40 bg-white/[0.03] p-5 transition hover:border-brand-400/70 hover:bg-white/[0.06]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.color} shadow-glow`}
                >
                  <a.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{a.title}</div>
                  <div className="text-[13px] leading-6 text-slate-400">{a.desc}</div>
                </div>
                <ArrowLeft className="h-5 w-5 text-slate-500 transition group-hover:-translate-x-1 group-hover:text-brand-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
