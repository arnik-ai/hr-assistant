"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, UserCheck, Briefcase, ShieldAlert, AlertCircle } from "lucide-react";
import AppNav from "@/components/AppNav";
import { getDashboardStats, type DashboardStats } from "@/lib/employees";

const CARDS = [
  { key: "employees", label: "کل کارمندان", icon: Users, color: "from-brand-400 to-brand-600" },
  { key: "active_employees", label: "کارمندان فعال", icon: UserCheck, color: "from-emerald-400 to-teal-600" },
  { key: "open_positions", label: "موقعیت‌های باز", icon: Briefcase, color: "from-amber-400 to-orange-600" },
  { key: "risk_alerts", label: "هشدارهای ریسک", icon: ShieldAlert, color: "from-red-400 to-rose-600" },
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
        <h1 className="mb-1 text-2xl font-bold text-slate-100">داشبورد مدیریتی</h1>
        <p className="mb-6 text-sm text-slate-400">نمای کلی وضعیت سازمان شما</p>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error} —{" "}
            <Link href="/login" className="underline">
              ورود
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
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
              <div className="mt-1 text-[13px] text-slate-400">{c.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 glass rounded-3xl border border-brand-400/40 p-6 text-center text-sm text-slate-400">
          برای مدیریت کارکنان به بخش{" "}
          <Link href="/employees" className="font-semibold text-brand-300 hover:text-brand-200">
            کارمندان
          </Link>{" "}
          بروید.
        </div>
      </main>
    </div>
  );
}
