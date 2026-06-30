"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  LayoutDashboard,
  Users,
  LogOut,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import BackButton from "./BackButton";

const LINKS = [
  { href: "/", label: "گفتگو", title: "پرسیدن سؤال از دستیار هوشمند", icon: MessageSquare },
  { href: "/dashboard", label: "داشبورد", title: "نمای کلی وضعیت شرکت", icon: LayoutDashboard },
  { href: "/employees", label: "کارمندان", title: "مدیریت کارکنان شرکت", icon: Users },
  { href: "/recruitment", label: "جذب", title: "آگهی استخدام، نامزدها و مصاحبه", icon: Briefcase },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="glass sticky top-0 z-30 border-b border-brand-400/40">
      {/* ردیف ۱: نوار عنوان (Title Bar) */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-fuchsia-500 shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gradient">دستیار هوشمند HR</span>
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>

      {/* ردیف ۲: ناوبری (زیر نوار عنوان) */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/5 px-2 py-2 md:px-4">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={l.title}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
