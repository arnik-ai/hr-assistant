"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  listEmployees,
  createEmployee,
  deleteEmployee,
} from "@/lib/employees";
import { formatToman, faNumber } from "@/lib/utils";
import { useAuthGuard } from "@/lib/authGuard";

const PAGE_SIZE = 10;

const CONTRACT_LABELS: Record<string, string> = {
  permanent: "دائم",
  temporary: "موقت",
  full_time: "تمام‌وقت",
  part_time: "پاره‌وقت",
  daily: "روزمزد",
  consulting: "مشاوره‌ای",
  hourly_driver: "راننده استیجاری",
};

export default function EmployeesPage() {
  const ready = useAuthGuard();
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // فرم افزودن
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [baseWage, setBaseWage] = useState("");
  const [contractType, setContractType] = useState("permanent");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees", page],
    queryFn: () => listEmployees(PAGE_SIZE, page * PAGE_SIZE),
    enabled: ready,
  });

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  }

  const createMut = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setFullName("");
      setPosition("");
      setBaseWage("");
      setShowForm(false);
      flash("کارمند با موفقیت ثبت شد ✓");
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      flash("کارمند حذف شد ✓");
    },
  });

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">کارمندان</h1>
            <p className="text-sm text-slate-400">مدیریت پرونده‌ی پرسنلی</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 rounded-2xl border border-brand-400/50 bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg"
          >
            <Plus className="h-4 w-4" />
            افزودن کارمند
          </button>
        </div>

        {isError && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            برای دیدن اطلاعات ابتدا وارد شوید —{" "}
            <Link href="/login" className="underline">ورود</Link>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300 ring-1 ring-emerald-500/20">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {/* فرم افزودن */}
        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMut.mutate({
                full_name: fullName,
                position: position || undefined,
                base_wage: baseWage ? Number(baseWage) : undefined,
                contract_type: contractType,
              });
            }}
            className="mb-6 grid grid-cols-1 gap-3 rounded-3xl border border-brand-400/40 bg-white/[0.03] p-5 sm:grid-cols-2"
          >
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام و نام خانوادگی *" required className={inputCls} />
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="سمت" className={inputCls} />
            <div>
              <input value={baseWage} onChange={(e) => setBaseWage(e.target.value)} placeholder="مزد مبنا (ریال)" type="number" className={`w-full ${inputCls}`} />
              {baseWage && <p className="mt-1 px-2 text-[12px] text-emerald-300">{formatToman(Number(baseWage))} ریال</p>}
            </div>
            <select value={contractType} onChange={(e) => setContractType(e.target.value)} className={inputCls}>
              {Object.entries(CONTRACT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button type="submit" disabled={createMut.isPending || !fullName} className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">
              {createMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              ذخیره کارمند
            </button>
          </form>
        )}

        {/* جدول */}
        <div className="glass overflow-hidden rounded-3xl border border-brand-400/40">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> در حال بارگذاری…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-slate-400">
              <Users className="h-10 w-10 opacity-40" />
              هنوز کارمندی ثبت نشده. با دکمه‌ی «افزودن کارمند» شروع کنید.
            </div>
          ) : (
            <table className="w-full text-right text-sm">
              <thead className="border-b border-white/10 text-[13px] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">نام</th>
                  <th className="px-4 py-3 font-medium">سمت</th>
                  <th className="px-4 py-3 font-medium">نوع قرارداد</th>
                  <th className="px-4 py-3 font-medium">مزد مبنا (ریال)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((emp) => (
                  <tr key={emp.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-slate-100">{emp.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{emp.position ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {emp.contract_type ? CONTRACT_LABELS[emp.contract_type] ?? emp.contract_type : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{emp.base_wage ? formatToman(emp.base_wage) : "—"}</td>
                    <td className="px-4 py-3 text-left">
                      <button onClick={() => setConfirmId(emp.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* صفحه‌بندی */}
        {total > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-slate-400">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 transition enabled:hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" /> قبلی
            </button>
            <span>
              صفحه {faNumber(page + 1)} از {faNumber(totalPages)}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 transition enabled:hover:bg-white/5 disabled:opacity-40"
            >
              بعدی <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmId !== null}
        title="حذف کارمند"
        message="آیا از حذف این کارمند مطمئن هستید؟ این کار قابل بازگشت نیست."
        onConfirm={() => {
          if (confirmId) deleteMut.mutate(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

const inputCls =
  "rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500";
