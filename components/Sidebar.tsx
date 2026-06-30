"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Sparkles, ShieldCheck, X, LayoutDashboard, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGES = [
  { src: "/hiring-playbook.jpg", alt: "هوش مصنوعی در جذب و استخدام" },
  { src: "/career-guidance.jpg", alt: "مشاوره مسیر شغلی" },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* بک‌دراپ — فقط موبایل، هنگام باز بودن */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          "glass z-50 flex h-full w-72 max-w-[85vw] shrink-0 flex-col gap-4 border border-brand-400/50 p-4",
          // حالت موبایل: کشویی از سمت راست
          "fixed inset-y-0 right-0 rounded-l-3xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          // حالت دسکتاپ: ثابت در جریان صفحه
          "md:static md:inset-auto md:translate-x-0 md:rounded-3xl"
        )}
      >
        {/* دکمه بستن — فقط موبایل */}
        <button
          onClick={onClose}
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* لوگو */}
        <div className="flex items-center gap-3 rounded-2xl border border-brand-400/40 bg-white/[0.03] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-fuchsia-500 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-gradient">
              دستیار هوشمند HR
            </h1>
            <p className="text-[11px] text-slate-400">HR Smart Assistant</p>
          </div>
        </div>

        {/* دکمه گفتگوی جدید */}
        <button className="group flex items-center justify-center gap-2 rounded-2xl border border-brand-400/50 bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg">
          <Plus className="h-4 w-4 transition group-hover:rotate-90" />
          گفتگوی جدید
        </button>

        {/* ناوبری */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            داشبورد
          </Link>
          <Link
            href="/employees"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Users className="h-[18px] w-[18px]" />
            کارمندان
          </Link>
          <Link
            href="/recruitment"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Briefcase className="h-[18px] w-[18px]" />
            جذب و استخدام
          </Link>
        </nav>

        {/* عکس‌ها */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-brand-400/50 bg-white/[0.03]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={320}
                height={180}
                loading="eager"
                unoptimized
                className="h-28 w-full object-cover sm:h-32"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* برند شرکت */}
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-brand-400/50 bg-white/[0.03] p-4 text-center">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            شرکت نیکان ایمن سلامت
          </div>
          <p className="text-[11px] text-slate-400">عضو پارک علم و فناوری</p>
        </div>
      </aside>
    </>
  );
}
