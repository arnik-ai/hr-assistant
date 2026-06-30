"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, LayoutDashboard, Users, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const LINKS = [
  { href: "/", label: "گفتگو", icon: MessageSquare },
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/employees", label: "کارمندان", icon: Users },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between border-b border-brand-400/40 px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-fuchsia-500 shadow-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="hidden text-sm font-bold text-gradient sm:block">
          دستیار هوشمند HR
        </span>
      </div>

      <nav className="flex items-center gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
              )}
            >
              <l.icon className="h-4 w-4" />
              <span className="hidden sm:block">{l.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">خروج</span>
        </button>
      </nav>
    </header>
  );
}
