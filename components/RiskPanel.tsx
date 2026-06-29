"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Scale,
  Lightbulb,
  HelpCircle,
  Calculator,
} from "lucide-react";
import type { AssistantResponse, RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; icon: typeof ShieldCheck; color: string; bg: string; ring: string }
> = {
  LOW: {
    label: "ریسک پایین",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
  MEDIUM: {
    label: "ریسک متوسط",
    icon: ShieldAlert,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  HIGH: {
    label: "ریسک بالا",
    icon: ShieldX,
    color: "text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-500/30",
  },
};

export default function RiskPanel({ data }: { data: AssistantResponse }) {
  const risk = RISK_CONFIG[data.risk_level];
  const RiskIcon = risk.icon;
  const hasCalc = Object.keys(data.calculation ?? {}).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-3 flex flex-col gap-3"
    >
      {/* نشان سطح ریسک */}
      <div
        className={cn(
          "flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
          risk.bg,
          risk.color,
          risk.ring
        )}
      >
        <RiskIcon className="h-4 w-4" />
        {risk.label}
      </div>

      {/* جدول محاسبات */}
      {hasCalc && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300">
            <Calculator className="h-4 w-4 text-brand-300" />
            جزئیات محاسبه
          </div>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(data.calculation).map(([k, v], i) => (
                <tr
                  key={k}
                  className={cn(i % 2 === 0 ? "bg-white/[0.02]" : "")}
                >
                  <td className="px-4 py-2 text-slate-400">{k}</td>
                  <td className="px-4 py-2 text-left font-medium text-slate-100">
                    {String(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* تحلیل حقوقی */}
      {data.legal_analysis?.length > 0 && (
        <Section icon={Scale} title="تحلیل حقوقی" color="text-brand-300">
          {data.legal_analysis.map((item, i) => (
            <li key={i} className="flex gap-2 text-[13px] text-slate-300">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
              {item}
            </li>
          ))}
        </Section>
      )}

      {/* توصیه‌ها */}
      {data.recommendations?.length > 0 && (
        <Section icon={Lightbulb} title="توصیه‌ها" color="text-emerald-300">
          {data.recommendations.map((item, i) => (
            <li key={i} className="flex gap-2 text-[13px] text-slate-300">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
              {item}
            </li>
          ))}
        </Section>
      )}

      {/* اطلاعات لازم */}
      {data.missing_information?.length > 0 && (
        <Section icon={HelpCircle} title="اطلاعات تکمیلی لازم" color="text-amber-300">
          {data.missing_information.map((item, i) => (
            <li key={i} className="flex gap-2 text-[13px] text-amber-200/80">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </Section>
      )}
    </motion.div>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof Scale;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className={cn("mb-2 flex items-center gap-2 text-xs font-semibold", color)}>
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <ul className="flex flex-col gap-1.5">{children}</ul>
    </div>
  );
}
